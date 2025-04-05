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

  try {
    const response = await fetch('src/assets/dict.json');
    if (!response.ok) throw new Error(`Failed to fetch dict.json: ${response.statusText}`);
    const urls = await response.json();

    const url = urls[lang];
    if (!url) throw new Error(`No URL found for language: ${lang}`);

    const textResponse = await fetch(url);
    if (!textResponse.ok)
      throw new Error(`Failed to fetch language file: ${textResponse.statusText}`);
    const text = await textResponse.text();

    const lines = text
      .trim()
      .split('\n')
      .map((line) => removeAccents(line.trim()));
    dict.value = [...new Set(lines)].join('\n');
  } catch (error) {
    console.error(error);
    dict.value = '';
  }
}

export function findWord(pattern) {
  const re = new RegExp('^' + pattern + '$', 'gmi');
  const matches = Array.from(dict.value.matchAll(re));
  return matches.map((match) => match[0]);
}

setDictLang('fr');
