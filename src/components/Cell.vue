<script setup>
import { computed } from 'vue';
import { store } from '@/store.js';

const props = defineProps({
  row: { type: Number, required: true },
  column: { type: Number, required: true }
});

const defSide = computed(() => store.defsSide[`${props.row},${props.column}`]);
const defBelow = computed(() => store.defsBelow[`${props.row},${props.column}`]);

function updateCell(event) {
  const text = event.target.value.trim();
  if (text.match(/^[a-z]?$/i)) {
    store.cells[props.row][props.column] = text;
  }
  event.target.value = store.cells[props.row][props.column];
};

function select() {
  store.lastRow = props.row;
  store.lastColumn = props.column;
}
</script>

<template>
  <input v-if="store.cells[row][column] != null" class="cell" @focus="select" @blur="updateCell"
    :value="store.cells[row][column]" />
  <div v-if="store.cells[row][column] == null" class="defs-container">
    <div v-if="defSide != undefined" class="definition def-side" @focus="select" contenteditable>{{
      defSide }}</div>
    <div v-if="defBelow != undefined" class="definition def-below" @focus="select" contenteditable>{{
      defBelow }}</div>
  </div>
</template>

<style scoped>
.cell {
  width: 100%;
  height: 100%;
  background-color: lightgray;
  color: black;
  border: solid 1px black;
  text-align: center;
  align-content: center;
  text-transform: uppercase;
  font-size: calc(var(--font-size));
}

.defs-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  background-color: darkgrey;
}

.definition {
  flex: 1 1 auto;
  width: 100%;
  color: black;
  border: solid 1px black;
  text-align: center;
  align-content: center;
  text-transform: uppercase;
  font-size: calc(var(--font-size) / 5);
  line-height: calc(var(--font-size) / 5);
  overflow: hidden;
  word-break: break-all;
  hyphens: auto;
}

.def-side::after {
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translate(100%, -50%);
  border: 15px solid transparent;
  border-left-color: black;
  content: '';
}

.def-below::after {
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 100%);
  border: 15px solid transparent;
  border-top-color: black;
  content: '';
}
</style>
