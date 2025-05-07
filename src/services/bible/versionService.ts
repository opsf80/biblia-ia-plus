
import { BibleVersion, BIBLE_VERSIONS } from './types';
import { queryBibleDatabase, callBibleApi } from './apiClient';

export const versionService = {
  // Get all available Bible versions
  getVersions: async (): Promise<BibleVersion[]> => {
    try {
      // Tente obter do Supabase
      const versions = await queryBibleDatabase('getVersions');
      
      if (versions && versions.length > 0) {
        return versions.map((version: any) => ({
          id: version.version_id,
          name: version.name,
          abbreviation: version.abbreviation,
          language: version.language
        }));
      }
      
      // Se não encontrar no banco de dados, use a API como fallback
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
  }
};
