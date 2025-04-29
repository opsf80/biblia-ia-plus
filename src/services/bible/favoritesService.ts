
import { BibleVerse } from './types';
import { supabase } from '@/integrations/supabase/client';

export const favoritesService = {
  // Save a verse as favorite
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
      console.error('Error saving favorite verse:', error);
      return false;
    }
  },

  // Get favorite verses
  getFavoriteVerses: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('favorite_verses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching favorite verses:', error);
      return [];
    }
  }
};
