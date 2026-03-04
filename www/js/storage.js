const DICTIONARY_URLS = ["./data/dictionary.json", "./assets/dictionary_final_id.json"];
const BOOKMARK_KEY = "bookmarks";

let dictionaryCache = null;

function normalizeEntry(entry) {
  const meaning =
    entry?.meaning_id ??
    entry?.meaningId ??
    entry?.meaning ??
    entry?.arti ??
    entry?.translation ??
    "";

  return {
    word: String(entry?.word ?? "").trim(),
    reading: String(entry?.reading ?? "").trim(),
    romaji: String(entry?.romaji ?? "").trim(),
    meaning_id: String(meaning).trim(),
    jlpt: String(entry?.jlpt ?? "").trim().toUpperCase(),
  };
}

async function fetchDictionaryJson() {
  let lastError = null;

  for (const url of DICTIONARY_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Gagal memuat file database dari ${url} (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Gagal memuat file database.");
}

export async function loadDictionary() {
  if (dictionaryCache) {
    return dictionaryCache;
  }

  const json = await fetchDictionaryJson();
  if (!Array.isArray(json)) {
    throw new Error("Format database tidak valid: harus array JSON.");
  }

  dictionaryCache = json.map(normalizeEntry);
  return dictionaryCache;
}

export function saveBookmark(word) {
  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]");
  bookmarks.push(word);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
}

export function getBookmarks() {
  return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]");
}
