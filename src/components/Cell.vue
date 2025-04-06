<script setup>
import { ref } from 'vue';
import { store } from '@/store.js';

const cellRef = ref(null);
defineExpose({ cellRef });

const props = defineProps({
  row: { type: Number, required: true },
  column: { type: Number, required: true }
});

function updateCell(event) {
  console.log(event);
  const text = event.target.value.trim();
  if (text == '') {
    store.cells[props.row][props.column] = null;
  } else if (text.match(/^[a-z]?$/i)) {
    store.cells[props.row][props.column] = text;
  }
  event.target.value = store.cells[props.row][props.column];
};
</script>

<template>
  <input ref="cellRef" class="cell" :class="{ 'definition': !store.cells[row][column] }"
    :value="store.cells[row][column]" @blur="updateCell" />
</template>

<style scoped>
.cell {
  width: 100%;
  height: 100%;
  background-color: lightgray;
  color: black;
  border: solid 1px black;
  text-align: center;
  text-transform: uppercase;
}

.definition {
  background-color: darkgrey;
}
</style>
