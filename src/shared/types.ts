export type CellData =
  | {
      type: "value";
      value: number | string;
    }
  | { type: "formula"; formula: string };