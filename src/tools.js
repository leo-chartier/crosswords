export function removeAccents(text, regex = false) {
  if (regex) text = text.replaceAll(' ', '.');
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase();
}
