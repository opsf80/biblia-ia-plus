
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VerseSearch from '@/components/bible/VerseSearch';
import { bibleService, BibleVerse } from '@/services/bibleService'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BibleSearchPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await bibleService.getFavoriteVerses();
      setFavorites(data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFavorite = async (verse: BibleVerse, version: string) => {
    if (!user) {
      toast.warning("Faça login para salvar versículos favoritos", {
        action: {
          label: "Entrar",
          onClick: () => window.location.href = "/auth"
        }
      });
      return;
    }
    
    try {
      const success = await bibleService.saveFavoriteVerse(verse, version);
      
      if (success) {
        toast.success("Versículo salvo como favorito");
        loadFavorites();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar versículo favorito");
    }
  };

  const formatReference = (favorite: any) => {
    return `${favorite.book} ${favorite.chapter}:${favorite.verse}`;
  };

  return (
    <Layout>
      <div className="container py-4">
        <h1 className="text-2xl font-bold mb-6">Busca Bíblica</h1>
        
        <Tabs defaultValue="search">
          <TabsList className="mb-6">
            <TabsTrigger value="search">Pesquisar Versículos</TabsTrigger>
            <TabsTrigger value="favorites">Meus Favoritos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pesquisa de Versículos</CardTitle>
              </CardHeader>
              <CardContent>
                <VerseSearch />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Versículos Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <>
                    {isLoading ? (
                      <div className="text-center py-8">Carregando favoritos...</div>
                    ) : favorites.length > 0 ? (
                      <div className="space-y-4">
                        {favorites.map((favorite) => (
                          <div key={favorite.id} className="p-4 border rounded-md">
                            <p className="text-lg font-medium mb-1">
                              {formatReference(favorite)} ({favorite.version})
                            </p>
                            <blockquote className="border-l-4 border-biblia-purple-500 pl-4 italic mb-2">
                              {favorite.text}
                            </blockquote>
                            <div className="text-xs text-muted-foreground">
                              Salvo em: {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Você ainda não tem versículos favoritos.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="mb-4 text-muted-foreground">
                      Faça login para salvar e visualizar seus versículos favoritos
                    </p>
                    <Button onClick={() => window.location.href = "/auth"}>
                      Entrar / Registrar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BibleSearchPage;
