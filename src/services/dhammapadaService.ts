import dhammapadaData from '../assets/data/dhammapada_max_muller_clean.json';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DhammapadaVerse {
  globalVerseNumber: string; // Keep as string to support "58, 59"
  chapterNumber: number;
  chapterTitle: string;
  chapterVerseNumber: string;
  text: string;
  pali?: string;
}

interface RawVerse {
  local: number | string;
  text: string;
  pali: string;
}

interface RawChapter {
  chapter_number: number;
  chapter_roman: string;
  chapter_title: string;
  verses: { [key: string]: RawVerse };
}

type RawDhammapadaData = RawChapter[];

const rawData = dhammapadaData as unknown as RawDhammapadaData;

// Flatten all verses once at module load.
const allVerses: DhammapadaVerse[] = rawData.flatMap((chapter) => {
  const chapterVerses = Object.entries(chapter.verses).map(([globalNum, v]) => ({
    globalVerseNumber: globalNum,
    chapterNumber: chapter.chapter_number,
    chapterTitle: chapter.chapter_title,
    chapterVerseNumber: String(v.local),
    text: v.text,
    pali: v.pali,
  }));

  // Sort verses within the chapter numerically by the first verse number in the key.
  return chapterVerses.sort((a, b) => {
    const aNum = parseInt(a.globalVerseNumber.split(',')[0], 10);
    const bNum = parseInt(b.globalVerseNumber.split(',')[0], 10);
    return aNum - bNum;
  });
});

// Fixed epoch so the same civil date maps to the same verse globally.
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const FIXED_EPOCH_UTC = Date.UTC(2020, 0, 1); // 2020‑01‑01 UTC

// ─── Helpers ───────────────────────────────────────────────────────────────────

function toUtcDateOnlyMs(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  return Date.UTC(year, month, day);
}

function normaliseIndex(idx: number, length: number): number {
  const mod = idx % length;
  return mod < 0 ? mod + length : mod;
}

function stripHtml(raw: string): string {
  // Remove simple block-level tags and anchors used in the source.
  let cleaned = raw.replace(/<[^>]+>/g, ' ');
  // Decode a few common entities we know appear in the text.
  cleaned = cleaned
    .replace(/&mdash;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function getAllVerses(): DhammapadaVerse[] {
  return allVerses;
}

export function getVerseByGlobalNumber(globalVerseNumber: string | number): DhammapadaVerse | undefined {
  const searchStr = String(globalVerseNumber);
  return allVerses.find((v) => v.globalVerseNumber === searchStr);
}

export function getVerseForDate(date: Date): DhammapadaVerse {
  const utcMs = toUtcDateOnlyMs(date);
  const daysSinceEpoch = Math.floor((utcMs - FIXED_EPOCH_UTC) / MS_PER_DAY);
  const index = normaliseIndex(daysSinceEpoch, allVerses.length);
  return allVerses[index];
}

export function getRandomVerse(excludeGlobalVerseNumber?: string | number): DhammapadaVerse {
  if (allVerses.length === 0) {
    throw new Error('Dhammapada data not available');
  }

  if (allVerses.length === 1) {
    return allVerses[0];
  }

  const excludeStr = excludeGlobalVerseNumber ? String(excludeGlobalVerseNumber) : undefined;

  let verse: DhammapadaVerse;
  do {
    const idx = Math.floor(Math.random() * allVerses.length);
    verse = allVerses[idx];
  } while (excludeStr && verse.globalVerseNumber === excludeStr);

  return verse;
}

export function getCleanVerseText(verse: DhammapadaVerse): string {
  return stripHtml(verse.text);
}

export function getVerseExcerpt(verse: DhammapadaVerse, maxChars = 120): string {
  const cleaned = getCleanVerseText(verse);
  if (cleaned.length <= maxChars) return cleaned;

  const truncated = cleaned.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');
  const safe = lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated;
  return `${safe.trim()}…`;
}

export function getVerseDisplayReference(verse: DhammapadaVerse): string {
  return `Verse ${verse.globalVerseNumber}`;
}

