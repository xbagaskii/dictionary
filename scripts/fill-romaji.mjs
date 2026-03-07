import { readFile, writeFile } from "node:fs/promises";
import { kanaToRomaji } from "../www/js/romaji.mjs";

const dictionaryPath = new URL("../www/data/dictionary.json", import.meta.url);
const forceRewrite = process.argv.includes("--force");

const text = await readFile(dictionaryPath, "utf8");
const data = JSON.parse(text);

if (!Array.isArray(data)) {
  throw new Error("dictionary.json harus berupa array.");
}

let filledCount = 0;
let fallbackFromWordCount = 0;

for (const entry of data) {
  const currentRomaji = String(entry?.romaji ?? "").trim();
  if (currentRomaji && !forceRewrite) {
    continue;
  }

  const reading = String(entry?.reading ?? "").trim();
  const word = String(entry?.word ?? "").trim();
  const fromReading = kanaToRomaji(reading);
  const fromWord = fromReading ? "" : kanaToRomaji(word);

  if (fromWord) {
    fallbackFromWordCount += 1;
  }

  const nextRomaji = fromReading || fromWord;
  if (entry.romaji !== nextRomaji) {
    entry.romaji = nextRomaji;
    filledCount += 1;
  }
}

await writeFile(dictionaryPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

console.log(`Selesai. Romaji diperbarui: ${filledCount} entri.`);
console.log(`Fallback dari word: ${fallbackFromWordCount} entri.`);
if (forceRewrite) {
  console.log("Mode: --force");
}
