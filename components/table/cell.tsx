import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { resolveValue, valueMap } from "./table";

export const Cell = observer(function Cell(props: { cellKey: string }) {
  // if (typeof window === "undefined") return null;
  const [isEdit, setIsEdit] = useState(false);

  const value = resolveValue(props.cellKey);

  const inputRef = useRef<HTMLInputElement>(null);

  if (isEdit) {
    return (
      <>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            const text = inputRef.current?.value;

            console.log("text", text);

            const [equals, ...asFormula] = text ?? "sdf sdfsd";

            if (equals === "=") {
              valueMap.set(props.cellKey, {
                type: "formula",
                formula: asFormula as any,
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
          <input ref={inputRef} type="text" className="input-control" />
        </form>
      </>
    );
  } else {
    return (
      <>
        <pre className="break-all text-gray-500">
          {JSON.stringify(valueMap.get(props.cellKey))}
        </pre>
        <button
          type="button"
          className="w-full h-10"
          onClick={() => {
            setIsEdit(true);
          }}
          // onClick={action(() => {
          //   valueMap.set(props.cellKey, {
          //     type: "value",
          //     value: Math.random(),
          //   });
          // })}
        >
          {value}
        </button>
      </>
    );
  }
});
