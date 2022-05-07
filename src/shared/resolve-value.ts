import { math } from './math';
import { appState } from './state';

export const resolveValue = (key: string) => {
  console.log(`resolve ${key}`);
  const data = appState.cells[key];

  try {
    const value =
      data?.type === 'value'
        ? data.value
        : data?.type === 'fn'
        ? math.evaluate(data.fn, {
            get: (key: string) => {
              return resolveValue(key);
            },
            set: (key: string, value: any) => {
              return appState.cells[key] = value;
            },
            has: (key: string) => Object.hasOwn(appState.cells, key),
            keys: () => Object.keys(appState.cells),
          })
        : undefined;
    return value;
  } catch (err) {
    console.warn(err);
    return `#ERROR#`;
  }
};

export const getEnteredValue = (key: string): string | undefined => {
  const data = appState.cells[key];
  return data?.raw;
  // const value =
  //   data?.type === 'value'
  //     ? String(data.value)
  //     : data?.type === 'fn'
  //     ? `=${data.fn}`
  //     : undefined;
};
