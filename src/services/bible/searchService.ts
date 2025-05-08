
import { BibleVerse, SearchResult } from './types';
import { queryBibleDatabase, callBibleApi } from './apiClient';
import { supabase } from '@/integrations/supabase/client';

export const searchService = {
  // Search for verses by text
  searchVerses: async (bibleId: string, query: string, limit: number = 10): Promise<SearchResult> => {
    try {
      // Log search to history if user is logged in
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        try {
          await supabase.from('verse_searches').insert({
            query,
            version: bibleId
          });
        } catch (err) {
          console.warn('Error saving search history:', err);
          // Continue even if this fails
        }
      }

      // Try to search in Supabase first
      try {
        const response = await queryBibleDatabase('search', { query, versionId: bibleId, limit });
        
        if (response && response.verses && response.verses.length > 0) {
          return {
            query,
            verses: response.verses.map((verse: any) => ({
              id: verse.id,
              reference: verse.reference || '',
              content: verse.text
            })),
            total: response.total || response.verses.length
          };
        }
      } catch (searchError) {
        console.log('Error searching in Supabase, using API:', searchError);
      }

      // Fall back to API if not found in Supabase
      const data = await callBibleApi('/search', { bibleId, query, limit });
      
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
      console.error('Error searching verses:', error);
      return {
        query,
        verses: [],
        total: 0
      };
    }
  }
};
