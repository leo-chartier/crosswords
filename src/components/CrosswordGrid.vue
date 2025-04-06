<script setup>
import { computed, onMounted, onUpdated, ref, watch } from 'vue';
import { store } from '@/store.js';
import Cell from '@/components/Cell.vue';

const nRows = computed(() => store.cells.length);
const nCols = computed(() => Math.max(...store.cells.map(row => row.length)));
const aspectRatio = computed(() => nCols.value / nRows.value);

const gridStyle = computed(() => {
  return {
    gridTemplateRows: `repeat(${nRows.value}, 1fr)`,
    gridTemplateColumns: `repeat(${nCols.value}, 1fr)`,
    width: `calc(min(100vw, (100vh - 50px) * ${aspectRatio.value}))`,
    height: `calc(min(100vh - 50px, 100vw / ${aspectRatio.value}))`
  };
});

const cellRefs = ref([]);
const observer = new ResizeObserver(entries => {
  for (let entry of entries) {
    const cell = entry.target;
    const size = Math.min(entry.contentRect.width, entry.contentRect.height);
    cell.style.fontSize = `${size * 0.8}px`;
  }
});

function updateObserver() {
  cellRefs.value.forEach(comp => {
    if (comp?.cellRef) {
      observer.observe(comp.cellRef);
    }
  });
}

watch(() => store.cells, () => {
  cellRefs.value = [];
});

onMounted(updateObserver);
onUpdated(updateObserver);
</script>

<template>
  <div class="grid-container">
    <div class="grid" :style="gridStyle">
      <template v-for="(row, i) in store.cells" :key="i">
        <div v-for="(cell, j) in row" :key="`${i}-${j}`" class="cell-container">
          <Cell ref="cellRefs" :row="i" :column="j" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 50px);
}

.grid {
  display: grid;
}

.cell-container {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
}
</style>
