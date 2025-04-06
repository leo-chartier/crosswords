<script setup>
import { store } from '@/store.js';
import { gridStyle } from '@/grid.js';
import Cell from '@/components/Cell.vue';
</script>

<template>
  <div class="grid-container">
    <div class="grid" :style="gridStyle">
      <template v-for="(row, i) in store.cells" :key="i">
        <div v-for="(cell, j) in row" :key="`${i}-${j}`" class="cell-container">
          <Cell :row="i" :column="j" />
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
