import { reactive } from 'vue';

export const store = reactive({
  // Notre Temps, grille n°2605, 6 avril 2025
  cells: [
    [null, 'p', null, 'u', null, 'f'],
    ['n', 'a', 'u', 's', 'e', 'e'],
    [null, 't', 'r', 'a', 'c', 't'],
    ['d', 'r', 'a', 'g', 'u', 'e'],
    [null, 'i', 'n', 'e', 's', null],
    ['p', 'o', 'i', 's', 's', 'e'],
    [null, 't', 'u', null, 'o', 'u'],
    ['c', 'e', 'm', 'e', 'n', 't'],
  ],
  defsSide: {
    '0,0': 'il est un peu chauvin',
    '0,2': 'coutumes',
    '0,4': "elle n'a pas l'air triste",
    '2,0': 'feuille orientée',
    '4,0': 'infante du portugal',
    '6,0': 'gardé secret',
    '6,3': "une question pour connâitre l'endroit",
  },
  defsBelow: {
    '0,0': 'malaise',
    '0,2': 'il brule en centrale',
    '0,4': 'blason cousu',
    '2,0': 'branche en boîte',
    '4,0': 'espèce de guigne',
    '4,5': 'roula dans la farine',
    '6,0': "protège l'ivoire à la racine",
  },
  lastRow: null,
  lastColumn: null,
});
