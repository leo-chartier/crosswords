<script setup>
import { resetGrid } from '@/grid';
import { ref } from 'vue';

const showModal = ref(false);
const width = ref(0);
const height = ref(0);
const hasError = ref(false);
let timeout = null;

function confirm() {
  hasError.value =
    !Number.isInteger(width.value) || width.value < 2 || width.value > 100
    || !Number.isInteger(height.value) || height.value < 2 || height.value > 100;

  if (hasError.value) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      hasError.value = false;
    }, 2000);
  } else {
    resetGrid(width.value, height.value);
    showModal.value = false;
  }
}
</script>

<template>
  <button @click="showModal = true">Reset grid</button>
  <div v-if="showModal" @close="showModal = false" class="modal-container">
    <div class="modal">
      <button @click="showModal = false" class="modal-close">Close</button>
      <h2>Grid reset</h2>
      <label for="width">Width</label>
      <input v-model.number="width" id="newWidth" name="width" min="2" max="100" />
      <label for="height">Height</label>
      <input v-model.number="height" id="newHeight" name="height" min="2" max="100" />
      <button @click="confirm">Confirm</button>
      <div v-if="hasError" class="error-message">Invalid values</div>
    </div>
  </div>
</template>

<style scoped>
button:last-of-type {
  margin-top: 10px;
}
</style>
