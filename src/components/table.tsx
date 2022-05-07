import times from 'lodash/times';
import { action, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Cell } from '../components/cell';
import { appState } from '../shared/state';
import useEventListener from '@use-it/event-listener';
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const COLUMN_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const InternalState = observer(function InternalState() {
  let serialized = toJS(appState) as any;
  return (
    <>
    <Link href={`/${JSON.stringify(serialized)}`}><a>Permalink</a></Link>
    <details className="text-xs">
      <summary>Internal state</summary>

      <pre>
        {JSON.stringify(serialized, undefined, 2)}
      </pre>
    </details>
    </>
  );
});

export const Table = observer(function Table() {
  useEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (appState.mode === 'edit') {
        runInAction(() => {
          appState.mode = undefined;
        });
      } else if (!appState.mode && appState.activeCell) {
        runInAction(() => {
          appState.activeCell = undefined;
        });
      }
    }
  });

  const router = useRouter();

  const initialData = router.query.slug?.[0];

 console.log(router.query)

  useEffect(() => {
    if (initialData) {
      console.log(`initialize initial data`)
      Object.assign(appState, JSON.parse(initialData))
    }
  }, [initialData])

  return (
    <>
      <table className="table-fixed mt-4 mr-4">
        <thead>
          <tr>
            <th style={{ minWidth: 40, width: 40, maxWidth: 40 }} />
            {times(appState.columns, (colIndex) => (
              <th
                key={colIndex}
                className="border border-black"
                style={{ minWidth: 100, width: 100, maxWidth: 100 }}
              >
                {COLUMN_LABELS[colIndex]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times(appState.rows, (rowIndex) => (
            <tr key={rowIndex}>
              <td className="text-center">{rowIndex + 1}</td>
              {times(appState.columns, (colIndex) => (
                <td
                  key={colIndex}
                  className="border border-black truncate p-0 relative h-12"
                >
                  <Cell cellKey={`${COLUMN_LABELS[colIndex]}${rowIndex + 1}`} />
                </td>
              ))}
              {rowIndex === 0 && (
                <td rowSpan={appState.rows} className="relative w-6">
                  <button
                    className="absolute inset-0 hover:bg-gray-100 w-6"
                    onClick={action(() => {
                      appState.columns += 1;
                    })}
                  >
                    +
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td></td>
            <td colSpan={appState.columns} className="h-6 relative">
              <button
                className="absolute inset-0 hover:bg-gray-100 h-6 w-full"
                onClick={action(() => {
                  appState.rows += 1;
                })}
              >
                +
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <InternalState />
    </>
  );
});
