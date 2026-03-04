import { loadDictionary } from "./storage.js";
import { searchWord } from "./search.js";

let dictionary = [];

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
      (entry) => `
      <div class="card">
        <div class="word">${entry.word || "-"}</div>
        <div>${entry.reading || "-"} ${entry.romaji ? `(${entry.romaji})` : ""}</div>
        <div class="meaning">${entry.meaning_id || "-"}</div>
        <div class="jlpt">Level: ${entry.jlpt || "-"}</div>
      </div>
    `
    )
    .join("");

  container.innerHTML = html;
}

function runSearch() {
  const keyword = el("searchInput").value;
  const jlpt = el("filterJLPT").value;

  const results = searchWord(dictionary, keyword, jlpt);
  el("resultMeta").textContent = `Menampilkan ${results.length} dari ${dictionary.length} entri.`;
  displayResults(results);
}

async function initApp() {
  const statusText = el("statusText");

  try {
    dictionary = await loadDictionary();
    statusText.textContent = `Database siap (${dictionary.length} entri).`;
    runSearch();
  } catch (error) {
    statusText.textContent = `Gagal memuat database: ${error.message}`;
    console.error(error);
  }

  el("searchInput").addEventListener("input", runSearch);
  el("filterJLPT").addEventListener("change", runSearch);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch((error) => {
      console.error("SW register failed:", error);
    });
  }
}

document.addEventListener("DOMContentLoaded", initApp);
