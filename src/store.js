import { reactive } from 'vue';

export const store = reactive({
  cells: [
    [null, '', null, '', null],
    ['', '', '', '', ''],
    [null, '', '', '', ''],
    ['', '', '', '', ''],
    [null, '', '', '', ''],
  ],
  defsSide: {
    '0,0': 'side test',
  },
  defsBelow: {
    '0,0': 'below test 1 2 3 4 5 6 7 8 9 very­long­word',
  },
  selectedRow: null,
  selectedColumn: null,
});
