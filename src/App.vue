<script setup>
import { cells } from '@/grid';
import CrosswordGrid from '@/components/CrosswordGrid.vue';
import GridSetup from '@/components/GridSetup.vue';
import HeaderBar from '@/components/HeaderBar.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import WordSearch from '@/components/WordSearch.vue';

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
  <LoadingScreen />
  <HeaderBar>
    <GridSetup />
    <WordSearch />
  </HeaderBar>
  <main>
    <CrosswordGrid :cells="cells" @update-cell="updateCell" />
  </main>
</template>
