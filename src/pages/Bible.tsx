
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import BibleReader from '@/components/bible/BibleReader';
import BibleBookList from '@/components/bible/BibleBookList';
import { Button } from '@/components/ui/button';
import { Search, Download, Book } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BIBLE_VERSIONS } from '@/services/bible';

const BiblePage = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImportData = async () => {
    if (isImporting) return;
    
    setIsImporting(true);
    
    try {
      toast({
        title: "Importação iniciada",
        description: "Iniciando importação dos dados da Bíblia. Isso pode levar alguns minutos..."
      });
      
      // Import data for each available Bible version
      for (const version of Object.values(BIBLE_VERSIONS)) {
        // Import books
        const { data: booksData, error: booksError } = await supabase.functions.invoke('bible-import', {
          body: { 
            action: 'import_books',
            bibleId: version.id
          }
        });
        
        if (booksError) throw booksError;
        if (!booksData.success) throw new Error(booksData.message);
        
        toast({
          title: `Livros importados para ${version.abbreviation}`,
          description: booksData.message
        });
      }
      
      toast({
        title: "Importação completa",
        description: "Os dados básicos foram importados com sucesso. Os capítulos e versículos serão importados conforme necessário."
      });
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      toast({
        title: "Erro na importação",
        description: error.message || "Ocorreu um erro ao importar os dados da Bíblia.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Bíblia Sagrada</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleImportData}
              disabled={isImporting}
            >
              <Download className="h-4 w-4 mr-2" />
              <span>{isImporting ? 'Importando...' : 'Importar dados'}</span>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/bible/search">
                <Search className="h-4 w-4 mr-2" />
                <span>Pesquisar</span>
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="reader">
          <TabsList className="mb-4">
            <TabsTrigger value="reader">
              <Book className="h-4 w-4 mr-2" />
              Ler Bíblia
            </TabsTrigger>
            <TabsTrigger value="books">
              <Book className="h-4 w-4 mr-2" />
              Livros
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reader">
            <BibleReader />
          </TabsContent>
          
          <TabsContent value="books">
            <BibleBookList />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BiblePage;
