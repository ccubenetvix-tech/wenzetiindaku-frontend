// Client-side product search used by the products page.
// The API only matches the exact phrase, so the page loads the catalogue and
// matches here: every word must match (any order), accents are ignored and
// small spelling mistakes are tolerated.

const normalize = (value: unknown): string =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const tokenize = (value: unknown): string[] =>
  normalize(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

// Levenshtein distance, stopping early once it exceeds `max`.
const withinDistance = (a: string, b: string, max: number): boolean => {
  if (Math.abs(a.length - b.length) > max) return false;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > max) return false;
    previous = current;
  }
  return previous[b.length] <= max;
};

// Allowed typos grow with word length: none for short words, 1 from 4 letters, 2 from 10.
const typoAllowance = (word: string) => (word.length >= 10 ? 2 : word.length >= 4 ? 1 : 0);

const wordMatches = (queryWord: string, haystackWords: string[], haystackText: string): boolean => {
  if (haystackText.includes(queryWord)) return true;
  const allowance = typoAllowance(queryWord);
  if (allowance === 0) return false;
  return haystackWords.some(
    (word) =>
      withinDistance(queryWord, word, allowance) ||
      // also accept a typo in the beginning of a longer word ("chargu" → "chargeur")
      (word.length > queryWord.length && withinDistance(queryWord, word.slice(0, queryWord.length), allowance)),
  );
};

export const matchesSearch = (searchText: string, fields: unknown[]): boolean => {
  const queryWords = tokenize(searchText);
  if (queryWords.length === 0) return true;
  const haystackText = fields.map(normalize).join(" ");
  const haystackWords = tokenize(haystackText);
  return queryWords.every((word) => wordMatches(word, haystackWords, haystackText));
};
