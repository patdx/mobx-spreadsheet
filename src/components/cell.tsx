import { isNil } from 'lodash';
import { action, computed, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { getEnteredValue, resolveValue } from '../shared/resolve-value';
import { appState, cellValueMap } from '../shared/state';

export const Cell = observer(function Cell(props: { cellKey: string }) {
  const isEdit = computed(() => appState.editingCell === props.cellKey).get();

  const cellData = cellValueMap.get(props.cellKey);

  const resolvedValue = resolveValue(props.cellKey);

  const inputRef = useRef<HTMLInputElement>(null);

  if (isEdit) {
    return (
      <>
        <form
          className="absolute inset-0"
          onSubmit={(evt) => {
            evt.preventDefault();
            const text = inputRef.current?.value;

            if (!text) {
              cellValueMap.delete(props.cellKey);
              return;
            }

            console.log('text', text);

            const isFormula = /^=/.test(text);

            if (isFormula) {
              cellValueMap.set(props.cellKey, {
                type: 'fn',
                raw: text,
                fn: text.replace(/^=/, ''),
              });
            } else {
              const asNumber = Number(text);
              cellValueMap.set(props.cellKey, {
                type: 'value',
                raw: text,
                value: Number.isFinite(asNumber) ? asNumber : text,
              });
            }

            runInAction(() => {
              appState.editingCell = undefined;
            });
          }}
        >
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="input-control w-full h-full text-center px-0"
            defaultValue={getEnteredValue(props.cellKey)}
          />
        </form>
      </>
    );
  } else {
    return (
      <button
        type="button"
        className="absolute inset-0"
        // className="w-full h-10"
        onClick={action(() => {
          appState.editingCell = props.cellKey;
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
