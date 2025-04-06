import { store } from '@/store';

export function resetGrid(width, height) {
  store.cells = Array.from({ length: height }, () => ' '.repeat(width));
}
