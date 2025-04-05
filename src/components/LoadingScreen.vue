<script setup lang="ts">
import { isLoading } from '@/tools';

</script>

<template>
  <div v-if="isLoading" class="modal-container">
    <span class="loader"></span>
  </div>
</template>

<style scoped>
/* https://cssloaders.github.io/ */
.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  box-sizing: border-box;
  position: relative;
  width: 40vmin;
  height: 40vmin;
  animation: spin 1s linear infinite;
}

.loader:after,
.loader:before {
  content: "";
  width: 20vmin;
  height: 20vmin;
  position: absolute;
  border-radius: 50%;
  background: #F00;
  animation: spin 1s linear infinite;
  transform-origin: 0px 100%;
}

.loader:before {
  transform-origin: 0 50%;
  background: #fff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
