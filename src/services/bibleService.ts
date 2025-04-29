
import { supabase } from '@/integrations/supabase/client';

// Tipos
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

// Versões disponíveis em português
export const BIBLE_VERSIONS = {
  BLFPT: { id: "d63894c8d9a7a503-01", name: "Bíblia Livre Para Todos", abbreviation: "BLFPT", language: "pt" },
  TFT: { id: "90799bb5b996fddc-01", name: "Translation for Translators", abbreviation: "TFT", language: "en" }
};

// Serviço para acessar a API da Bíblia
export const bibleService = {
  // Buscar todas as versões disponíveis
  getVersions: async (): Promise<BibleVersion[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        path: '/versions'
      });
      
      if (error) throw error;
      
      // Filtrar apenas versões em português
      const versions = data.data
        .filter((bible: any) => bible.language.id === 'por' || bible.language.id === 'eng')
        .map((bible: any) => ({
          id: bible.id,
          name: bible.name,
          abbreviation: bible.abbreviationLocal || bible.abbreviation,
          language: bible.language.id
        }));
      
      return versions;
    } catch (error) {
      console.error('Erro ao buscar versões da Bíblia:', error);
      return Object.values(BIBLE_VERSIONS);
    }
  },

  // Buscar todos os livros de uma versão
  getBooks: async (bibleId: string): Promise<BibleBook[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        path: '/books',
        query: { bibleId }
      });
      
      if (error) throw error;
      
      return data.data.map((book: any) => ({
        id: book.id,
        name: book.name,
        nameLong: book.nameLong,
        abbreviation: book.abbreviation,
        testament: book.testament
      }));
    } catch (error) {
      console.error('Erro ao buscar livros da Bíblia:', error);
      return [];
    }
  },

  // Buscar capítulos de um livro
  getChapters: async (bibleId: string, bookId: string): Promise<BibleChapter[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        path: '/chapters',
        query: { bibleId, bookId }
      });
      
      if (error) throw error;
      
      return data.data.map((chapter: any) => ({
        id: chapter.id,
        number: chapter.number,
        bookId: chapter.bookId
      }));
    } catch (error) {
      console.error('Erro ao buscar capítulos:', error);
      return [];
    }
  },

  // Buscar versículos de um capítulo
  getVerses: async (bibleId: string, chapterId: string): Promise<BibleVerse[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        path: '/verses',
        query: { bibleId, chapterId }
      });
      
      if (error) throw error;
      
      return data.data.map((verse: any) => ({
        id: verse.id,
        reference: verse.reference,
        content: verse.content
      }));
    } catch (error) {
      console.error('Erro ao buscar versículos:', error);
      return [];
    }
  },

  // Buscar um versículo específico
  getVerse: async (bibleId: string, verseId: string): Promise<BibleVerse | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        path: '/verse',
        query: { bibleId, verseId }
      });
      
      if (error) throw error;
      
      return {
        id: data.data.id,
        reference: data.data.reference,
        content: data.data.content
      };
    } catch (error) {
      console.error('Erro ao buscar versículo:', error);
      return null;
    }
  },

  // Pesquisar versículos por texto
  searchVerses: async (bibleId: string, query: string, limit: number = 10): Promise<SearchResult> => {
    try {
      // Registrar a busca no histórico (se usuário estiver logado)
      if (supabase.auth.getUser()) {
        try {
          await supabase.from('verse_searches').insert({
            query,
            version: bibleId
          });
        } catch (err) {
          console.warn('Erro ao salvar histórico de busca:', err);
          // Continua mesmo se falhar
        }
      }

      const { data, error } = await supabase.functions.invoke('bible-api', {
        path: '/search',
        query: { bibleId, query, limit }
      });
      
      if (error) throw error;
      
      return {
        query,
        verses: data.data.verses.map((verse: any) => ({
          id: verse.id,
          reference: verse.reference,
          content: verse.text
        })),
        total: data.data.total
      };
    } catch (error) {
      console.error('Erro na pesquisa de versículos:', error);
      return {
        query,
        verses: [],
        total: 0
      };
    }
  },

  // Buscar uma passagem específica
  getPassage: async (bibleId: string, passageId: string): Promise<BibleVerse | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        path: '/passage',
        query: { bibleId, passageId }
      });
      
      if (error) throw error;
      
      return {
        id: data.data.id,
        reference: data.data.reference,
        content: data.data.content
      };
    } catch (error) {
      console.error('Erro ao buscar passagem:', error);
      return null;
    }
  },

  // Salvar versículo como favorito
  saveFavoriteVerse: async (verse: BibleVerse, version: string): Promise<boolean> => {
    try {
      const [book, chapterVerse] = verse.reference.split(' ');
      const [chapter, verseNum] = chapterVerse.split(':');

      const { error } = await supabase.from('favorite_verses').insert({
        book,
        chapter: parseInt(chapter, 10),
        verse: parseInt(verseNum, 10),
        version,
        text: verse.content
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar versículo favorito:', error);
      return false;
    }
  },

  // Buscar versículos favoritos
  getFavoriteVerses: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('favorite_verses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar versículos favoritos:', error);
      return [];
    }
  }
};
