<script setup>
import CrosswordGrid from '@/components/CrosswordGrid.vue';
import GridSetup from '@/components/GridSetup.vue';
import HeaderBar from '@/components/HeaderBar.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import TakePicture from './components/TakePicture.vue';
import ToggleDefinitions from './components/ToggleDefinitions.vue';
import WordSearch from '@/components/WordSearch.vue';
</script>

<template>
  <LoadingScreen />
  <HeaderBar>
    <GridSetup />
    <TakePicture />
    <ToggleDefinitions />
    <WordSearch />
  </HeaderBar>
  <main>
    <CrosswordGrid />
  </main>
</template>
