import { loadDictionary } from "./storage.js";
import { kanaToRomaji } from "./romaji.mjs";
import { searchWord } from "./search.js";

let dictionary = [];
const DISPLAY_LIMIT = 220;

function el(id) {
  return document.getElementById(id);
}

function displayResults(results) {
  const container = el("results");
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = "<p>Tidak ditemukan.</p>";
    return;
  }

  const html = results
    .map(
      (entry) => {
        const romaji =
          String(entry?.romaji ?? "").trim() ||
          kanaToRomaji(entry?.reading ?? "") ||
          kanaToRomaji(entry?.word ?? "");

        return `
      <div class="card">
        <div class="word">${entry.word || "-"}</div>
        <div>${entry.reading || "-"} ${romaji ? `(${romaji})` : ""}</div>
        <div class="meaning">${entry.meaning_id || "-"}</div>
        <div class="jlpt">Level: ${entry.jlpt || "-"}</div>
      </div>
    `;
      }
    )
    .join("");

  container.innerHTML = html;
}

function runSearch() {
  const keyword = el("searchInput").value;
  const jlpt = el("filterJLPT").value;

  const matches = searchWord(dictionary, keyword, jlpt);
  const visibleResults = matches.slice(0, DISPLAY_LIMIT);
  displayResults(visibleResults);
}

function debounce(fn, waitMs) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

function removeLegacyResultMeta() {
  const legacyMeta = el("resultMeta");
  if (legacyMeta) {
    legacyMeta.remove();
  }
}

async function clearLegacyServiceWorkerCache() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((cacheName) => cacheName.startsWith("kamus-cache"))
        .map((cacheName) => caches.delete(cacheName))
    );
  }
}

async function initApp() {
  const statusText = el("statusText");
  removeLegacyResultMeta();
  clearLegacyServiceWorkerCache().catch((error) => {
    console.warn("Tidak bisa membersihkan cache lama:", error);
  });

  try {
    dictionary = await loadDictionary();
    statusText.textContent = `Database siap (${dictionary.length} entri).`;
    runSearch();
  } catch (error) {
    statusText.textContent = `Gagal memuat database: ${error.message}`;
    console.error(error);
  }

  const runSearchDebounced = debounce(runSearch, 90);
  el("searchInput").addEventListener("input", runSearchDebounced);
  el("filterJLPT").addEventListener("change", runSearch);
}

document.addEventListener("DOMContentLoaded", initApp);
