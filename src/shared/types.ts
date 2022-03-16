interface CellBase {
  /** raw input entered by user */
  raw?: string;
}

interface ValueCell extends CellBase {
  type: 'value';
  value: number | string;
}

interface FunctionCell extends CellBase {
  type: 'fn';
  fn: string;
}

export type CellData = ValueCell | FunctionCell;
