
import { BibleVersion, BIBLE_VERSIONS } from './types';
import { callBibleApi } from './apiClient';

export const versionService = {
  // Get all available Bible versions
  getVersions: async (): Promise<BibleVersion[]> => {
    try {
      const data = await callBibleApi('/versions');
      
      // Filter only versions in Portuguese and English
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
      console.error('Error fetching Bible versions:', error);
      return Object.values(BIBLE_VERSIONS);
    }
  }
};
