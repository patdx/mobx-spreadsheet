import times from 'lodash/times';
import { action, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useKey } from 'rooks';
import { Cell } from '../components/cell';
import { moveCell } from '../shared/cell-util';
import { appState } from '../shared/state';
import * as v from 'valibot';

const COLUMN_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const InternalState = observer(function InternalState() {
  let serialized = toJS(appState) as any;
  return (
    <>
      <a href={`/${encodeURIComponent(JSON.stringify(serialized))}`}>
        Permalink
      </a>
      <details className="text-xs">
        <summary>Internal state</summary>

        <pre>{JSON.stringify(serialized, undefined, 2)}</pre>
      </details>
    </>
  );
});

const INPUT_TRIGGERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

export const Table = observer(function Table() {
  useKey(['Escape'], () => {
    if (appState.mode === 'edit') {
      runInAction(() => {
        appState.mode = undefined;
      });
    } else if (!appState.mode && appState.activeCell) {
      runInAction(() => {
        appState.activeCell = undefined;
      });
    }
  });

  useKey(
    ['Enter'],
    (event) => {
      event.preventDefault();
      console.log('enter key triggered');
      if (!appState.mode && appState.activeCell) {
        runInAction(() => {
          appState.mode = 'edit';
        });
      }
    },
    { when: !appState.mode },
  );

  useKey(['ArrowUp'], (event) => {
    event.preventDefault();
    runInAction(() => {
      appState.mode = undefined;
      appState.activeCell = moveCell(appState.activeCell, { dy: -1 });
    });
  });

  useKey(['ArrowDown'], (event) => {
    event.preventDefault();
    runInAction(() => {
      appState.mode = undefined;
      appState.activeCell = moveCell(appState.activeCell, { dy: 1 });
    });
  });

  useKey(
    ['ArrowLeft'],
    (event) => {
      event.preventDefault();
      runInAction(() => {
        appState.mode = undefined;
        appState.activeCell = moveCell(appState.activeCell, { dx: -1 });
      });
    },
    { when: !appState.mode },
  );

  useKey(
    ['ArrowRight'],
    (event) => {
      event.preventDefault();
      runInAction(() => {
        appState.mode = undefined;
        appState.activeCell = moveCell(appState.activeCell, { dx: 1 });
      });
    },
    { when: !appState.mode },
  );

  const initialData = useMemo(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (!path) return null;

    const slug = v.parse(v.nullish(v.string(), null), path);
    if (!slug) return null;

    try {
      return decodeURIComponent(slug);
    } catch (err) {
      return slug;
    }
  }, []);

  console.log('initialData', initialData);

  useEffect(() => {
    if (initialData) {
      console.log(`initialize initial data`);
      Object.assign(appState, JSON.parse(initialData));
    }
  }, [initialData]);

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
