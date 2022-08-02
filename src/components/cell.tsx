import { isNil } from 'lodash';
import { action, computed, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { getEnteredValue, resolveValue } from '../shared/resolve-value';
import { appState } from '../shared/state';
import clsx from 'clsx';

export const Cell = observer(function Cell(props: { cellKey: string }) {
  const isActive = computed(() => appState.activeCell === props.cellKey).get();
  const isEdit = computed(
    () => appState.activeCell === props.cellKey && appState.mode === 'edit'
  ).get();

  const cellData = appState.cells[props.cellKey];

  const resolvedValue = resolveValue(props.cellKey);

  const inputRef = useRef<HTMLInputElement>(null);

  if (isEdit) {
    return (
      <>
        <form
          className={clsx('absolute inset-0', isActive && 'bg-gray-100')}
          onSubmit={(evt) => {
            console.log("input submitted")
            evt.preventDefault();
            const text = inputRef.current?.value;

            if (!text) {
              delete appState.cells[props.cellKey];
              return;
            }

            console.log('text', text);

            const isFormula = /^=/.test(text);

            runInAction(() => {
              if (isFormula) {
                appState.cells[props.cellKey] = {
                  type: 'fn',
                  raw: text,
                  fn: text.replace(/^=/, ''),
                };
              } else {
                const asNumber = Number(text);
                appState.cells[props.cellKey] = {
                  type: 'value',
                  raw: text,
                  value: Number.isFinite(asNumber) ? asNumber : text,
                };
              }
              appState.mode = undefined;
            });
          }}
        >
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="input-control w-full h-full text-center px-0 bg-gray-100"
            defaultValue={getEnteredValue(props.cellKey)}
          />
        </form>
      </>
    );
  } else {
    return (
      <button
        type="button"
        className={clsx('absolute inset-0 w-full', isActive && 'bg-gray-100')}
        // className="w-full h-10"
        onClick={action(() => {
          appState.activeCell = props.cellKey;
          appState.mode = 'edit';
        })}
      >
        {cellData?.type === 'fn' ? (
          <pre className="break-all text-gray-500 text-xs">
            {getEnteredValue(props.cellKey)}
          </pre>
        ) : undefined}

        {isNil(resolvedValue) || resolvedValue === '' ? null : (
          <div className="tabular-nums truncate" data-comment="resolved-value">
            {resolvedValue}
          </div>
        )}
      </button>
    );
  }
});
