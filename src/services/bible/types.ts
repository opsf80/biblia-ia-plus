
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

// Available Bible versions
export const BIBLE_VERSIONS = {
  BLFPT: { id: "d63894c8d9a7a503-01", name: "Bíblia Livre Para Todos", abbreviation: "BLFPT", language: "pt" },
  TFT: { id: "90799bb5b996fddc-01", name: "Translation for Translators", abbreviation: "TFT", language: "en" }
};
