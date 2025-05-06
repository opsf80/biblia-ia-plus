
// Types for Bible service
export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

export interface BibleBook {
  id: string;
  name: string;
  nameLong: string;
  abbreviation: string;
  testament: string;
}

export interface BibleChapter {
  id: string;
  number: string;
  bookId: string;
}

export interface BibleVerse {
  id: string;
  orgId?: string;
  bibleId?: string;
  bookId?: string;
  chapterId?: string;
  reference: string;
  content: string;
}

export interface SearchResult {
  query: string;
  verses: BibleVerse[];
  total: number;
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

export interface HighlightedVerse {
  id: number;
  verse_id: string;
  reference: string;
  content: string;
  color: HighlightColor;
  created_at: string;
  user_id?: string;
}

// Available Bible versions
export const BIBLE_VERSIONS = {
  BLFPT: { id: "d63894c8d9a7a503-01", name: "Bíblia Livre Para Todos", abbreviation: "BLFPT", language: "pt" },
  TFT: { id: "90799bb5b996fddc-01", name: "Translation for Translators", abbreviation: "TFT", language: "en" }
};

// Available Bible translations for simple API
export const SIMPLE_TRANSLATIONS = {
  ALMEIDA: { id: "almeida", name: "Almeida Revisada Imprensa Bíblica", abbreviation: "ARC", language: "pt" },
  NVI: { id: "nvi", name: "Nova Versão Internacional", abbreviation: "NVI", language: "pt" },
  KJV: { id: "kjv", name: "King James Version", abbreviation: "KJV", language: "en" }
};
