<script setup>
import { ref } from 'vue'

const cells = ref([['a', '#'], ['', 'c']]);

import CrosswordGrid from './components/CrosswordGrid.vue'

function updateCell({ event, i, j }) {
  const text = event.target.innerText.trim();
  let char = text ? text.slice(-1) : "";
  if (!char.match(/^[a-z]?$/i))
    char = cells.value[i][j];
  event.target.innerText = cells.value[i][j] = char;

  // Move cursor to the end
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(event.target);
  range.collapse(false); // Move cursor
  selection.removeAllRanges();
  selection.addRange(range);
};
</script>

<template>
  <main>
    <CrosswordGrid :cells="cells" @update-cell="updateCell" />
  </main>
</template>
