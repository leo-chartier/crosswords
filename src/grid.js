import { ref } from 'vue';

export const cells = ref(['test', 'a']);

export function resetGrid(width, height) {
  cells.value = Array.from({ length: height }, () => ' '.repeat(width));
}
