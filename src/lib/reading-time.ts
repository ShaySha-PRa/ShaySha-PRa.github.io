export function readingTime(text: string) {
  const chineseCharacters = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latinWords = text
    .replace(/[\u3400-\u9fff]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const words = chineseCharacters + latinWords;
  return { words, minutes: Math.max(1, Math.ceil(words / 200)) };
}
