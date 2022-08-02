const CELL_NAME_REGEX = /(?<col>[A-Z]+)(?<row>[0-9]+)/;

// 'A'.charCodeAt(0) // 65

export const parseCellName = (cellName: string) => {
  // const parsed = CELL_NAME_REGEX.exec(cellName);
  const parsed = cellName.match(CELL_NAME_REGEX);
  const rowName = parsed?.groups?.row;
  const colName = parsed?.groups?.col;
  const row = typeof rowName === 'string' ? parseInt(rowName, 10) : undefined;
  const col =
    typeof colName === 'string' ? colName.charCodeAt(0) - 64 : undefined;

  return {
    rowName,
    colName,
    row,
    col,
  };
};

export const moveCell = (
  cellName?: string,
  options?: { dx?: number; dy?: number }
): string | undefined => {
  if (typeof cellName !== 'string') return undefined;
  const { row, col } = parseCellName(cellName);
  if (typeof row !== 'number' || typeof col !== 'number') {
    // could not be parsed, do not change
    return cellName;
  }
  const dx = options?.dx ?? 0;
  const dy = options?.dy ?? 0;
  const newRow = row + dy;
  const newCol = col + dx;

  return `${String.fromCharCode(newCol + 64)}${newRow}`;
};
