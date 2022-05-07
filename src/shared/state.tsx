import { makeAutoObservable, ObservableMap } from 'mobx';
import { normalizeInitialCellData } from './normalize';
import type { CellData } from './types';

export const appState = makeAutoObservable({
  rows: 10,
  columns: 5,
  // UI
  activeCell: undefined as string | undefined,
  // UI
  mode: undefined as 'edit' | undefined,
  cells: normalizeInitialCellData({
    A1: { type: 'value', value: 1 },
    A2: { type: 'value', value: 'TE' },
    B2: { type: 'value', value: 'ST' },
    C2: { type: 'fn', fn: 'concat(A2,B2)' },
    B1: { type: 'value', value: 2 },
    C1: {
      type: 'fn',
      fn: 'A1+B1',
    },
    D1: {
      type: 'fn',
      fn: 'sum(A1:C1)',
    },
  }),
});
