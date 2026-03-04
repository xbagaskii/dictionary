function normalizeText(value) {
  return String(value ?? "").toLowerCase().trim();
}

function normalizeJLPT(value) {
  return String(value ?? "").trim().toUpperCase();
}

function isMatch(entry, keyword, jlptFilter) {
  const matchesKeyword =
    !keyword ||
    normalizeText(entry.word).includes(keyword) ||
    normalizeText(entry.reading).includes(keyword) ||
    normalizeText(entry.romaji).includes(keyword) ||
    normalizeText(entry.meaning_id).includes(keyword);

  const matchesJLPT =
    !jlptFilter || normalizeJLPT(entry.jlpt) === normalizeJLPT(jlptFilter);

  return matchesKeyword && matchesJLPT;
}

export function searchWord(dictionary, keyword, jlptFilter, limit = Infinity) {
  const normalizedKeyword = normalizeText(keyword);

  return dictionary
    .filter((entry) => isMatch(entry, normalizedKeyword, jlptFilter))
    .slice(0, limit);
}
