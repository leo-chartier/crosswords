import { computed, ref } from 'vue';

const dict = ref(null);

export const isLoading = computed(() => dict.value == null);

export function removeAccents(text, regex = false) {
  if (regex) text = text.replaceAll(' ', '.');
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase();
}

export async function setDictLang(lang) {
  dict.value = null;
  await fetch('src/assets/dict.json')
    .then((response) => response.json())
    .then((urls) => urls[lang])
    .then((url) =>
      fetch(url)
        .then((response) => response.text())
        .then((text) => {
          const lines = text
            .trim()
            .split('\n')
            .map((line) => line.trim())
            .map((line) => removeAccents(line));
          dict.value = [...new Set(lines)].join('\n');
        })
        .catch((reason) => {
          console.error(reason);
          dict.value = '';
        }),
    )
    .catch((reason) => {
      console.error(reason);
      dict.value = '';
    });
}

export function findWord(pattern) {
  const re = new RegExp('^' + pattern + '$', 'gmi');
  const matches = Array.from(dict.value.matchAll(re));
  return matches.map((match) => match[0]);
}

setDictLang('fr');
