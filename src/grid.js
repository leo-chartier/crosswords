import { store } from '@/store';
import { computed } from 'vue';

const nRows = computed(() => store.cells.length);
const nCols = computed(() => Math.max(...store.cells.map((row) => row.length)));
const aspectRatio = computed(() => nCols.value / nRows.value);
export const gridStyle = computed(() => {
  return {
    '--font-size': `min((100vh - 50px) / ${nRows.value}, 100vw / ${nCols.value}) * 0.8`,
    gridTemplateRows: `repeat(${nRows.value}, 1fr)`,
    gridTemplateColumns: `repeat(${nCols.value}, 1fr)`,
    width: `calc(min(100vw, (100vh - 50px) * ${aspectRatio.value}))`,
    height: `calc(min(100vh - 50px, 100vw / ${aspectRatio.value}))`,
  };
});

export function resetGrid(width, height) {
  store.cells = Array.from({ length: height }, () => Array.from({ length: width }, () => ' '));
  store.defsSide = {};
  store.defsBelow = {};

  for (let i = 0; i < height; i += 2) toggleDefinitions(i, 0);
  for (let j = 2; j < width; j += 2) toggleDefinitions(0, j);
}

function canPlaceSide(row, column) {
  if (row == nRows.value) return false;
  column++;
  if (row == 0) return canPlaceBelow(row - 1, column);
  let length;
  for (length = 0; column < nCols.value && store.cells[row][column] != null; column++) length++;
  return length > 1;
}

function canPlaceBelow(row, column) {
  if (row == nRows.value) return false;
  row++;
  if (column == 0) return canPlaceSide(row, column - 1);
  let length;
  for (length = 0; row < nRows.value && store.cells[row][column] != null; row++) length++;
  return length > 1;
}

function findLeft(row, column) {
  let length = -1;
  do {
    column--;
    length++;
  } while (column >= 0 && store.cells[row][column] != null);
  if (column == -1) {
    column = 0;
    row--;
  }
  return [row, column, length];
}

function findAbove(row, column) {
  let length = -1;
  do {
    row--;
    length++;
  } while (row >= 0 && store.cells[row][column] != null);
  if (row == -1) {
    row = 0;
    column--;
  }
  return [row, column, length];
}

export function canToggleDefinitions(row, column) {
  if (row == null || column == null) return false;

  if (store.cells[row][column] == null) {
    // Disable defs
    if (row == 0 || column == 0) return ((row + column) & 1) != 0;
    return true;
  }
  // Enable defs
  if (row == 0 || column == 0) return ((row + column) & 1) == 0;
  if (!canPlaceSide(row, column) && !canPlaceBelow(row, column)) return false;
  // Check that it doesn't break any definition
  let [r1, c1, l1] = findLeft(row, column);
  let [r2, c2, l2] = findAbove(row, column);
  let lengthLeft = l1 >= 2;
  let lengthAbove = l2 >= 2;
  let leftHasBelow = store.defsBelow[`${r1},${c1}`] != undefined;
  let aboveHasSide = store.defsSide[`${r2},${c2}`] != undefined;
  // TODO: Edge case of (row == 1 || column == 1)
  return (
    (lengthLeft && lengthAbove) ||
    (lengthLeft && aboveHasSide) ||
    (lengthAbove && leftHasBelow) ||
    (leftHasBelow && aboveHasSide)
  );
}

export function toggleDefinitions(row, column) {
  if (!canToggleDefinitions(row, column)) return;

  let [rowLeft, columnLeft, lengthLeft] = findLeft(row, column);
  let [rowAbove, columnAbove, lengthAbove] = findAbove(row, column);

  const key = `${row},${column}`;
  const keyLeft = `${rowLeft},${columnLeft}`;
  const keyAbove = `${rowAbove},${columnAbove}`;

  if (store.cells[row][column] == null) {
    // Delete defs
    store.cells[row][column] = '';
    delete store.defsSide[key];
    delete store.defsBelow[key];
    if (lengthLeft < 2 && rowLeft > 0) {
      if (rowLeft == row) {
        store.defsSide[keyLeft] = '';
      } else {
        store.defsBelow[keyLeft] = '';
      }
    }
    if (lengthAbove < 2 && columnAbove > 0) {
      if (columnAbove == column) {
        store.defsBelow[keyAbove] = '';
      } else {
        store.defsSide[keyAbove] = '';
      }
    }
  } else {
    // Add defs
    store.cells[row][column] = null;
    if (canPlaceSide(row, column)) store.defsSide[key] = '';
    if (canPlaceBelow(row, column)) store.defsBelow[key] = '';
    if (lengthLeft < 2 && rowLeft > 0) {
      if (rowLeft == row) {
        delete store.defsSide[keyLeft];
      } else {
        delete store.defsBelow[keyLeft];
      }
    }
    if (lengthAbove < 2 && columnAbove > 0) {
      if (columnAbove == column) {
        delete store.defsBelow[keyAbove];
      } else {
        delete store.defsSide[keyAbove];
      }
    }
  }
}
