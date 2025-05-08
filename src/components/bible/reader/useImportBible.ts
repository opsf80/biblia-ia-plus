
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImportBible = () => {
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const { toast } = useToast();

  const importBooks = async () => {
    setIsImporting(true);
    try {
      toast({
        title: "Importando livros",
        description: "Aguarde enquanto importamos os dados da Bíblia..."
      });
      
      const { data, error } = await supabase.functions.invoke('bible-import', {
        body: { 
          action: 'import_books',
          bibleId: 'default'
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Importação concluída",
          description: data.message
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erro ao importar livros:', error);
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const importChapters = async (bibleId: string, bookId: string) => {
    setIsImporting(true);
    try {
      toast({
        title: "Importando capítulos",
        description: "Aguarde enquanto importamos os capítulos..."
      });
      
      const { data, error } = await supabase.functions.invoke('bible-import', {
        body: { 
          action: 'import_chapters',
          bibleId,
          bookId
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Importação concluída",
          description: data.message
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erro ao importar capítulos:', error);
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const importVerses = async (bibleId: string, chapterId: string) => {
    setIsImporting(true);
    try {
      toast({
        title: "Importando versículos",
        description: "Aguarde enquanto importamos os versículos..."
      });
      
      const { data, error } = await supabase.functions.invoke('bible-import', {
        body: { 
          action: 'import_verses',
          bibleId,
          chapterId
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Importação concluída",
          description: data.message
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erro ao importar versículos:', error);
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importBooks,
    importChapters,
    importVerses
  };
};
