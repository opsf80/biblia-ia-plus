
import { BibleBook, BibleChapter, BibleVerse, HighlightColor } from './types';
import { queryBibleDatabase, callBibleApi } from './apiClient';
import { supabase } from '@/integrations/supabase/client';

export const contentService = {
  // Get all books for a specific Bible version
  getBooks: async (bibleId: string): Promise<BibleBook[]> => {
    try {
      // Tente obter do Supabase
      const books = await queryBibleDatabase('getBooks', { versionId: bibleId });
      
      if (books && Array.isArray(books) && books.length > 0) {
        return books.map((book: any) => ({
          id: book.id,
          name: book.name,
          nameLong: book.name,
          abbreviation: book.abbreviation || '',
          testament: book.testament || ''
        }));
      }
      
      // Se não encontrar no banco de dados, use a API
      const data = await callBibleApi('/books', { bibleId });
      
      return data.data.map((book: any) => ({
        id: book.id,
        name: book.name,
        nameLong: book.nameLong,
        abbreviation: book.abbreviation,
        testament: book.testament
      }));
    } catch (error) {
      console.error('Error fetching Bible books:', error);
      return [];
    }
  },

  // Get chapters for a specific book
  getChapters: async (bibleId: string, bookId: string): Promise<BibleChapter[]> => {
    try {
      // Tente obter do Supabase
      const chapters = await queryBibleDatabase('getChapters', { bookId });
      
      if (chapters && Array.isArray(chapters) && chapters.length > 0) {
        return chapters.map((chapter: any) => ({
          id: chapter.id,
          number: chapter.number.toString(),
          bookId: bookId
        }));
      }
      
      // Se não encontrar no banco de dados, use a API
      const data = await callBibleApi('/chapters', { bibleId, bookId });
      
      return data.data.map((chapter: any) => ({
        id: chapter.id,
        number: chapter.number,
        bookId: chapter.bookId
      }));
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
  },

  // Get verses for a specific chapter
  getVerses: async (bibleId: string, chapterId: string): Promise<BibleVerse[]> => {
    try {
      // Tente obter do Supabase
      const verses = await queryBibleDatabase('getVerses', { chapterId });
      
      if (verses && Array.isArray(verses) && verses.length > 0) {
        return verses.map((verse: any) => ({
          id: verse.id,
          reference: verse.reference || '',
          content: verse.text,
          number: verse.number
        }));
      }
      
      // Se não encontrar no banco de dados, use a API
      const data = await callBibleApi('/verses', { bibleId, chapterId });
      
      // Fetch verse IDs
      const verseIds = data.data.map((verse: any) => ({
        id: verse.id,
        reference: verse.reference
      }));
      
      // Then fetch each verse content separately
      const versesWithContent: BibleVerse[] = [];
      
      for (const verseData of verseIds) {
        try {
          const verseDetails = await callBibleApi('/verse', { 
            bibleId, 
            verseId: verseData.id 
          });
          
          versesWithContent.push({
            id: verseData.id,
            reference: verseData.reference,
            content: verseDetails.data.content
          });
        } catch (error) {
          console.error(`Error fetching verse content for ${verseData.id}:`, error);
        }
      }
      
      return versesWithContent;
    } catch (error) {
      console.error('Error fetching verses:', error);
      return [];
    }
  },

  // Get a specific verse
  getVerse: async (bibleId: string, verseId: string): Promise<BibleVerse | null> => {
    try {
      const data = await callBibleApi('/verse', { bibleId, verseId });
      
      return {
        id: data.data.id,
        reference: data.data.reference,
        content: data.data.content
      };
    } catch (error) {
      console.error('Error fetching verse:', error);
      return null;
    }
  },

  // Get a specific passage
  getPassage: async (bibleId: string, passageId: string): Promise<BibleVerse | null> => {
    try {
      const data = await callBibleApi('/passage', { bibleId, passageId });
      
      return {
        id: data.data.id,
        reference: data.data.reference,
        content: data.data.content
      };
    } catch (error) {
      console.error('Error fetching passage:', error);
      return null;
    }
  },

  // Get a verse using the simple bible-api.com
  getSimpleVerse: async (reference: string, translation: string = 'almeida'): Promise<any> => {
    try {
      const data = await callBibleApi('/simple-verse', { 
        reference, 
        translation 
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching simple verse:', error);
      throw error;
    }
  },

  // Highlight a verse with a specific color
  highlightVerse: async (verseId: string, reference: string, content: string, color: HighlightColor): Promise<boolean> => {
    try {
      // Use explicit type casting to bypass TypeScript's limitations
      // since the table exists but TypeScript doesn't know about it yet
      const { error } = await (supabase
        .from('highlighted_verses' as any)
        .insert({
          verse_id: verseId,
          reference,
          content,
          color,
          user_id: supabase.auth.getUser() ? (await supabase.auth.getUser()).data.user?.id : null
        } as any));
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error highlighting verse:', error);
      return false;
    }
  },

  // Get highlighted verses
  getHighlightedVerses: async (): Promise<any[]> => {
    try {
      // Use explicit type casting to bypass TypeScript's limitations
      const { data, error } = await (supabase
        .from('highlighted_verses' as any)
        .select('*')
        .order('created_at', { ascending: false }));
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching highlighted verses:', error);
      return [];
    }
  },

  // Delete a highlighted verse
  deleteHighlightedVerse: async (id: number): Promise<boolean> => {
    try {
      // Use explicit type casting to bypass TypeScript's limitations
      const { error } = await (supabase
        .from('highlighted_verses' as any)
        .delete()
        .eq('id', id));
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting highlighted verse:', error);
      return false;
    }
  }
};
