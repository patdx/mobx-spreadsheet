import { all, create } from "mathjs";
import { ObservableMap } from "mobx";

const math = create(all);

type CellData =
  | {
      type: "value";
      value: number;
    }
  | { type: "formula"; formula: string };

export const valueMap = new ObservableMap<string, CellData>({
  A1: { type: "value", value: 1 },
  B1: { type: "value", value: 2 },
  C1: {
    type: "formula",
    formula: "A1 + B1",
  },
});

export const resolveValue = (key: string) => {
  console.log(`resolve ${key}`);
  const data = valueMap.get(key);
  const value =
    data?.type === "value"
      ? data.value
      : data?.type === "formula"
      ? math.evaluate(data.formula, {
          get: (key: string) => {
            return resolveValue(key);
          },
          set: (key: string, value: any) => valueMap.set(key, value),
          has: (key: string) => valueMap.has(key),
          keys: () => valueMap.keys(),
        })
      : undefined;
  return value;
};
