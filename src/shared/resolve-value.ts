import { math } from "./math";
import { cellValueMap } from "./state";

export const resolveValue = (key: string) => {
  console.log(`resolve ${key}`);
  const data = cellValueMap.get(key);

  try {
    const value =
      data?.type === "value"
        ? data.value
        : data?.type === "formula"
        ? math.evaluate(data.formula, {
            get: (key: string) => {
              return resolveValue(key);
            },
            set: (key: string, value: any) => cellValueMap.set(key, value),
            has: (key: string) => cellValueMap.has(key),
            keys: () => cellValueMap.keys(),
          })
        : undefined;
    return value;
  } catch (err) {
    console.warn(err);
    return `#ERROR#`;
  }
};

export const getEnteredValue = (key: string): string | undefined => {
  const data = cellValueMap.get(key);
  const value =
    data?.type === "value"
      ? String(data.value)
      : data?.type === "formula"
      ? `=${data.formula}`
      : undefined;

  return value;
};
