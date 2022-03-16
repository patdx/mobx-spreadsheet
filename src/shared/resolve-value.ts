import { math } from './math';
import { cellValueMap } from './state';
import { CellData } from './types';

export const resolveValue = (key: string) => {
  console.log(`resolve ${key}`);
  const data = cellValueMap.get(key);

  try {
    const value =
      data?.type === 'value'
        ? data.value
        : data?.type === 'fn'
        ? math.evaluate(data.fn, {
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
  return data?.raw;
  // const value =
  //   data?.type === 'value'
  //     ? String(data.value)
  //     : data?.type === 'fn'
  //     ? `=${data.fn}`
  //     : undefined;
};
