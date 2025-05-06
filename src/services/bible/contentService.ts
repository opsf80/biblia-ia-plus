
import { BibleBook, BibleChapter, BibleVerse } from './types';
import { callBibleApi } from './apiClient';

export const contentService = {
  // Get all books for a specific Bible version
  getBooks: async (bibleId: string): Promise<BibleBook[]> => {
    try {
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
      const data = await callBibleApi('/verses', { bibleId, chapterId });
      
      // First fetch verse IDs
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
  }
};
