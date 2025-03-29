<script setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  cells: { type: Array, required: true }
});

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const width = computed(() => (props.cells || [])[0]?.length);
const height = computed(() => props.cells?.length);

function cellSize () {
  const maxWidth = windowWidth.value / width.value;
  const maxHeight = windowHeight.value / height.value;
  return Math.min(maxWidth, maxHeight);
};

const gridStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${width.value || 0}, ${cellSize()}px)`
  };
});

const cellStyle = computed(() => {
  return {
    width: cellSize() + "px",
    height: cellSize() + "px",
    lineHeight: cellSize() + "px",
    textAlign: "center",
    fontSize: cellSize() * 0.75 + "px",
    textTransform: "uppercase",
    border: "1px solid #000",
  };
});

onMounted(() => {
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  });
});
</script>

<template>
  <div class="grid" :style="gridStyle">
    <div
      v-for="(row, i) in cells"
      :key="i">
      <div
        v-for="(cell, j) in row"
        :key="j"
        :style="cellStyle"
        contenteditable
        @input="$emit('update-cell', {event: $event, i, j})">
        {{ cell }}
      </div>
    </div>
  </div>
</template>
