<script setup>
import { computed } from 'vue';

const props = defineProps({
  cells: { type: Array, required: true }
});

const nRows = computed(() => props.cells.length);
const nCols = computed(() => Math.max(...props.cells.map(row => row.length)));
const aspectRatio = computed(() => nCols.value / nRows.value);

const gridStyle = computed(() => {
  return {
    gridTemplateRows: `repeat(${nRows.value}, 1fr)`,
    gridTemplateColumns: `repeat(${nCols.value}, 1fr)`,
    width: `calc(min(100vw, (100vh - 50px) * ${aspectRatio.value}))`,
    height: `calc(min(100vh - 50px, 100vw / ${aspectRatio.value}))`
  };
});
</script>

<template>
  <div class="grid-container">
    <div class="grid" :style="gridStyle">
      <template v-for="(row, i) in props.cells" :key="i">
        <div v-for="(cell, j) in row.padEnd(nCols, ' ')" :key="`${i}-${j}`" class="cell-container">
          <div class="cell">{{ cell }}</div>
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

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: lightgray;
  color: black;
  border: solid 1px black;
}
</style>
