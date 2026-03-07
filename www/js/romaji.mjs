const BASIC_ROMAJI = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "o",
  ん: "n",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  ゔ: "vu",
  ゐ: "wi",
  ゑ: "we",
  ぁ: "a",
  ぃ: "i",
  ぅ: "u",
  ぇ: "e",
  ぉ: "o",
};

const COMBO_ROMAJI = {
  きゃ: "kya",
  きゅ: "kyu",
  きょ: "kyo",
  ぎゃ: "gya",
  ぎゅ: "gyu",
  ぎょ: "gyo",
  しゃ: "sha",
  しゅ: "shu",
  しょ: "sho",
  じゃ: "ja",
  じゅ: "ju",
  じょ: "jo",
  ちゃ: "cha",
  ちゅ: "chu",
  ちょ: "cho",
  にゃ: "nya",
  にゅ: "nyu",
  にょ: "nyo",
  ひゃ: "hya",
  ひゅ: "hyu",
  ひょ: "hyo",
  びゃ: "bya",
  びゅ: "byu",
  びょ: "byo",
  ぴゃ: "pya",
  ぴゅ: "pyu",
  ぴょ: "pyo",
  みゃ: "mya",
  みゅ: "myu",
  みょ: "myo",
  りゃ: "rya",
  りゅ: "ryu",
  りょ: "ryo",
  いぇ: "ye",
  うぃ: "wi",
  うぇ: "we",
  うぉ: "wo",
  ふぁ: "fa",
  ふぃ: "fi",
  ふぇ: "fe",
  ふぉ: "fo",
  ふゅ: "fyu",
  しぇ: "she",
  じぇ: "je",
  ちぇ: "che",
  すぃ: "si",
  ずぃ: "zi",
  つぁ: "tsa",
  つぃ: "tsi",
  つぇ: "tse",
  つぉ: "tso",
  てぃ: "ti",
  でぃ: "di",
  とぅ: "tu",
  どぅ: "du",
  てゅ: "tyu",
  でゅ: "dyu",
  てゃ: "tya",
  てょ: "tyo",
  でゃ: "dya",
  でょ: "dyo",
  ゔぁ: "va",
  ゔぃ: "vi",
  ゔぇ: "ve",
  ゔぉ: "vo",
  ゔゅ: "vyu",
  くぁ: "kwa",
  くぃ: "kwi",
  くぇ: "kwe",
  くぉ: "kwo",
  ぐぁ: "gwa",
  ぐぃ: "gwi",
  ぐぇ: "gwe",
  ぐぉ: "gwo",
};

function toHiragana(value) {
  return value.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
}

function isSimpleSeparator(char) {
  return char === ";" || char === "," || char === "(" || char === ")" || char === "~";
}

function readNextRomaji(text, fromIndex) {
  for (let i = fromIndex; i < text.length; i += 1) {
    const char = text[i];
    if (char === "っ" || char === "ー" || /\s/.test(char)) {
      continue;
    }

    const pair = text.slice(i, i + 2);
    if (COMBO_ROMAJI[pair]) {
      return COMBO_ROMAJI[pair];
    }

    if (BASIC_ROMAJI[char]) {
      return BASIC_ROMAJI[char];
    }

    return "";
  }

  return "";
}

function appendLongVowel(result) {
  for (let i = result.length - 1; i >= 0; i -= 1) {
    const char = result[i];
    if ("aiueo".includes(char)) {
      return result + char;
    }
  }
  return result;
}

export function kanaToRomaji(value) {
  const source = String(value ?? "").trim();
  if (!source) {
    return "";
  }

  if (/\p{Script=Han}/u.test(source)) {
    return "";
  }

  const text = toHiragana(source);
  let romaji = "";
  let doubleConsonant = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === "っ") {
      doubleConsonant = true;
      continue;
    }

    if (char === "ー") {
      romaji = appendLongVowel(romaji);
      continue;
    }

    if (char === "、") {
      romaji += ", ";
      continue;
    }

    if (char === "。") {
      romaji += ".";
      continue;
    }

    if (char === "・") {
      romaji += " ";
      continue;
    }

    if (char === "～") {
      romaji += "~";
      continue;
    }

    if (char === "　" || /\s/.test(char)) {
      romaji += " ";
      continue;
    }

    if (isSimpleSeparator(char)) {
      romaji += char;
      continue;
    }

    const pair = text.slice(i, i + 2);
    let chunk = COMBO_ROMAJI[pair];
    if (chunk) {
      i += 1;
    } else {
      chunk = BASIC_ROMAJI[char];
    }

    if (!chunk) {
      if (/[A-Za-z0-9\-./]/.test(char)) {
        romaji += char;
      }
      doubleConsonant = false;
      continue;
    }

    if (doubleConsonant) {
      const consonant = chunk.match(/^[bcdfghjklmnpqrstvwxyz]/)?.[0];
      if (consonant) {
        romaji += consonant;
      }
      doubleConsonant = false;
    }

    if (chunk === "n") {
      const next = readNextRomaji(text, i + 1);
      romaji += next && /^[aiueoy]/.test(next) ? "n'" : "n";
      continue;
    }

    romaji += chunk;
  }

  return romaji.replace(/\s+/g, " ").trim();
}
