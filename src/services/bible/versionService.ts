
import { BibleVersion, BIBLE_VERSIONS } from './types';
import { queryBibleDatabase, callBibleApi } from './apiClient';

export const versionService = {
  // Get all available Bible versions
  getVersions: async (): Promise<BibleVersion[]> => {
    try {
      // Attempt to get from Supabase
      const versions = await queryBibleDatabase('getVersions');
      
      if (versions && Array.isArray(versions) && versions.length > 0) {
        return versions.map((version: any) => ({
          id: version.version_id,
          name: version.name,
          abbreviation: version.abbreviation,
          language: version.language
        }));
      }
      
      // Fall back to API if not found in database
      const data = await callBibleApi('/versions');
      
      // Filter only versions in Portuguese and English
      const apiVersions = data.data
        .filter((bible: any) => bible.language.id === 'por' || bible.language.id === 'eng')
        .map((bible: any) => ({
          id: bible.id,
          name: bible.name,
          abbreviation: bible.abbreviationLocal || bible.abbreviation,
          language: bible.language.id
        }));
      
      return apiVersions;
    } catch (error) {
      console.error('Error fetching Bible versions:', error);
      return Object.values(BIBLE_VERSIONS);
    }
  },

  // Get Portuguese and English Bible books directly from Supabase tables
  getBibleBooks: async (language: 'pt' | 'en'): Promise<any[]> => {
    try {
      const books = await queryBibleDatabase('getBooks', { language });
      
      if (books && Array.isArray(books)) {
        // Group books by testament (1-39: Old Testament, 40+: New Testament)
        const oldTestament = books
          .filter(book => parseInt(book.liv) <= 39)
          .map(book => ({
            id: book.liv,
            name: book.livro,
            testament: 'Antigo'
          }));
          
        const newTestament = books
          .filter(book => parseInt(book.liv) > 39)
          .map(book => ({
            id: book.liv,
            name: book.livro,
            testament: 'Novo'
          }));
          
        return [...oldTestament, ...newTestament];
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching Bible books for language ${language}:`, error);
      return [];
    }
  }
};
