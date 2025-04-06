<script setup>
import { canToggleDefinitions, toggleDefinitions } from '@/grid';
import { store } from '@/store';
</script>

<template>
  <button :disabled="!canToggleDefinitions(store.lastRow, store.lastColumn)"
    @click="toggleDefinitions(store.lastRow, store.lastColumn)">Toggle definitions</button>
</template>
