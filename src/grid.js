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
}
