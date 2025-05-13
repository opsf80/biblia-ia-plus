
import { supabase } from '@/integrations/supabase/client';

// Helper function to call Bible API via edge function
export async function callBibleApi(endpoint: string, params?: Record<string, any>) {
  try {
    const { data, error } = await supabase.functions.invoke('bible-api', {
      body: { endpoint, params }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Bible API error (${endpoint}):`, error);
    throw error;
  }
}

// Helper function to query Bible data from Supabase database
export async function queryBibleDatabase(action: string, params?: Record<string, any>) {
  console.log(`Consultando Supabase: ação ${action} com parâmetros:`, params);
  
  try {
    switch (action) {
      case 'getVersions':
        const { data: versions, error: versionsError } = await supabase
          .from('bible_versions')
          .select('*')
          .order('language', { ascending: true })
          .order('name', { ascending: true });
        
        if (versionsError) throw versionsError;
        return versions;
        
      case 'getBooks':
        if (params?.language === 'pt') {
          // Get Portuguese books
          const { data: ptBooks, error: ptError } = await supabase
            .from('tbbiblia_pt')
            .select('liv, livro')
            .order('liv', { ascending: true });
          
          if (ptError) throw ptError;
          return ptBooks;
        } else if (params?.language === 'en') {
          // Get English books
          const { data: enBooks, error: enError } = await supabase
            .from('tbbiblia_en')
            .select('liv, livro')
            .order('liv', { ascending: true });
          
          if (enError) throw enError;
          return enBooks;
        } else {
          // Fallback to existing logic
          const { data: books, error: booksError } = await supabase
            .from('bible_books')
            .select('*')
            .eq('version_id', params?.versionId || '')
            .order('position', { ascending: true });
          
          if (booksError) throw booksError;
          return books;
        }
        
      case 'getChapters':
        const { data: chapters, error: chaptersError } = await supabase
          .from('bible_chapters')
          .select('*')
          .eq('book_id', params?.bookId || '')
          .order('number', { ascending: true });
        
        if (chaptersError) throw chaptersError;
        return chapters;
        
      case 'getVerses':
        const { data: verses, error: versesError } = await supabase
          .from('bible_verses')
          .select('*')
          .eq('chapter_id', params?.chapterId || '')
          .order('number', { ascending: true });
        
        if (versesError) throw versesError;
        return verses;
        
      case 'search':
        // Fix: Define standalone interface types to avoid infinite instantiation
        interface BibleVerseSearch {
          id: string;
          reference?: string | null;
          text: string;
        }
        
        // Create a separately defined result type that doesn't reference itself
        interface SearchResultType {
          verses: Array<{
            id: string;
            reference?: string | null;
            text: string;
          }>;
          total: number;
        }
        
        const { data: searchResults, error: searchError } = await supabase
          .from('bible_verses')
          .select('id, reference, text')  // Explicitly select only needed columns
          .textSearch('text', params?.query || '')
          .eq('version_id', params?.versionId || '')
          .limit(params?.limit || 10);
        
        if (searchError) throw searchError;
        
        // Explicitly create the output object without type reference recursion
        const result: SearchResultType = {
          verses: searchResults ? searchResults.map((verse) => ({
            id: verse.id,
            reference: verse.reference,
            text: verse.text
          })) : [],
          total: searchResults?.length || 0
        };
        
        return result;
        
      default:
        throw new Error(`Ação não implementada: ${action}`);
    }
  } catch (error) {
    console.error(`Erro na consulta ao banco de dados: ${action}:`, error);
    throw error;
  }
}
