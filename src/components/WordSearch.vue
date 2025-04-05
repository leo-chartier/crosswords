<script setup>
import { findWord, removeAccents } from '@/tools';
import { ref } from 'vue';

const showModal = ref(false);
const matches = ref([]);

function update(event) {
  const pattern = removeAccents(event.target.value, true);
  event.target.value = pattern;
  matches.value = findWord(pattern);
}
</script>

<template>
  <button @click="showModal = true">Search word</button>
  <div v-if="showModal" @close="showModal = false" class="modal-container">
    <div class="modal">
      <button @click="showModal = false" class="modal-close">Close</button>
      <h2>Word search</h2>
      <input type="search" pattern="[ .A-Za-z]*" @change="update" />
      <span class="match-count">{{ matches.length }} match{{ matches.length == 1 ? '' : 'es' }}</span>
      <div v-if="matches.length" class="word-list">
        <div v-for="word in matches" :key="word">
          {{ word }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  width: auto;
}

.match-count {
  position: absolute;
  right: 20px;
}

.word-list {
  margin-top: 10px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 0 10px;
}
</style>
