import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { getEnteredValue, resolveValue, valueMap } from "./table";

export const Cell = observer(function Cell(props: { cellKey: string }) {
  // if (typeof window === "undefined") return null;
  const [isEdit, setIsEdit] = useState(false);

  const cellData = valueMap.get(props.cellKey);

  const resolvedValue = resolveValue(props.cellKey);

  const inputRef = useRef<HTMLInputElement>(null);

  if (isEdit) {
    return (
      <>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            const text = inputRef.current?.value;

            if (!text) {
              valueMap.delete(props.cellKey);
              return;
            }

            console.log("text", text);

            const isFormula = /^=/.test(text);

            if (isFormula) {
              valueMap.set(props.cellKey, {
                type: "formula",
                formula: text.replace(/^=/, ""),
              });
            } else {
              valueMap.set(props.cellKey, {
                type: "value",
                value: Number(text),
              });
            }

            setIsEdit(false);
          }}
        >
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="input-control w-full h-full"
            defaultValue={getEnteredValue(props.cellKey)}
          />
        </form>
      </>
    );
  } else {
    return (
      <button
        type="button"
        className="w-full h-10"
        onClick={() => {
          setIsEdit(true);
        }}
      >
        {cellData?.type === "formula" ? (
          <pre className="break-all text-gray-500">
            {getEnteredValue(props.cellKey)}
          </pre>
        ) : undefined}

        <pre>{resolvedValue}</pre>
      </button>
    );
  }
});
