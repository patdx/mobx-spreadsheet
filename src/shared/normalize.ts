import type { CellData } from './types';

export const normalizeInitialCellData = (
  data: Record<string, Partial<CellData>>
) => {
  for (const item of Object.values(data)) {
    if (item.type === 'fn') {
      if (typeof item.fn === 'string' && item.raw !== 'string') {
        item.raw = `=${item.fn}`;
      }
    }
    if (item.type === 'value') {
      if (item.value != null && item.raw !== 'string') {
        item.raw = String(item.value);
      }
    }
  }

  return data as Record<string, CellData>;
};
