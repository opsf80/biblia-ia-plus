
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
  content?: string;
  text?: string;
  number?: number;
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
  BLFPT: { id: "7142879509583d59-01", name: "Biblia Livre", abbreviation: "BLFPT", language: "pt" },
  ARC: { id: "de4e12af7f28f599-01", name: "Almeida Revista e Corrigida", abbreviation: "ARC", language: "pt" },
  NVI: { id: "592420522e16049f-01", name: "Nova Versão Internacional", abbreviation: "NVI", language: "pt" },
  NVT: { id: "b32b9d1b65124a7b-01", name: "Nova Versão Transformadora", abbreviation: "NVT", language: "pt" },
  KJV: { id: "9879dbb7cfe39e4d-01", name: "King James Version", abbreviation: "KJV", language: "en" },
  NIV: { id: "55ec700d9e0d77ea-01", name: "New International Version", abbreviation: "NIV", language: "en" }
};

// Available Bible translations for simple API
export const SIMPLE_TRANSLATIONS = {
  ALMEIDA: { id: "almeida", name: "Almeida Revisada Imprensa Bíblica", abbreviation: "ARC", language: "pt" },
  NVI: { id: "nvi", name: "Nova Versão Internacional", abbreviation: "NVI", language: "pt" },
  KJV: { id: "kjv", name: "King James Version", abbreviation: "KJV", language: "en" }
};
