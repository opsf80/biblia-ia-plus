
import { BibleVersion, BIBLE_VERSIONS } from './types';
import { callBibleApi, callBibleMySql } from './apiClient';

export const versionService = {
  // Get all available Bible versions
  getVersions: async (): Promise<BibleVersion[]> => {
    try {
      // Tente primeiro obter do MySQL
      try {
        const response = await callBibleMySql('getVersions', {});
        
        if (response && response.length > 0) {
          return response.map((version: any) => ({
            id: version.id,
            name: version.name,
            abbreviation: version.abbreviation,
            language: version.language
          }));
        }
      } catch (mysqlError) {
        console.log('Erro ao obter versões do MySQL, usando API:', mysqlError);
      }
      
      // Se falhar, use a API
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
