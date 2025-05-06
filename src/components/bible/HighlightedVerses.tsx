import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Share } from 'lucide-react';
import { toast } from 'sonner';
import { contentService } from '@/services/bible';
import { HighlightedVerse, HighlightColor } from '@/services/bible/types';
import { useAuth } from '@/hooks/use-auth';
import { HIGHLIGHT_COLORS } from './SimpleVerseSearch';

const HighlightedVerses = () => {
  const [verses, setVerses] = useState<HighlightedVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadHighlightedVerses();
    }
  }, [user]);

  const loadHighlightedVerses = async () => {
    setIsLoading(true);
    try {
      const data = await contentService.getHighlightedVerses();
      setVerses(data);
    } catch (error) {
      console.error('Error loading highlighted verses:', error);
      toast.error('Erro ao carregar versículos destacados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await contentService.deleteHighlightedVerse(id);
      if (success) {
        setVerses(verses.filter(verse => verse.id !== id));
        toast.success('Destaque removido');
      }
    } catch (error) {
      console.error('Error deleting highlight:', error);
      toast.error('Erro ao remover destaque');
    }
  };

  const handleShare = (verse: HighlightedVerse) => {
    const shareText = `${verse.content} - ${verse.reference}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Versículo Destacado',
        text: shareText,
        url: window.location.href,
      }).catch(err => console.error('Erro ao compartilhar:', err));
    } else {
      // Fallback para copiar para área de transferência
      navigator.clipboard.writeText(shareText)
        .then(() => toast.success("Versículo copiado para a área de transferência"))
        .catch(err => {
          console.error('Erro ao copiar:', err);
          toast.error("Erro ao copiar versículo");
        });
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="mb-4 text-muted-foreground">
          Faça login para visualizar e gerenciar seus versículos destacados
        </p>
        <Button onClick={() => window.location.href = "/auth"}>
          Entrar / Registrar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Versículos Destacados</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadHighlightedVerses}
          disabled={isLoading}
        >
          Atualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando versículos destacados...</p>
        </div>
      ) : verses.length > 0 ? (
        <div className="grid gap-4">
          {verses.map((verse) => (
            <Card key={verse.id}>
              <CardHeader className={`py-2 ${HIGHLIGHT_COLORS[verse.color as HighlightColor]}`}>
                <CardTitle className="text-sm font-medium">{verse.reference}</CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <p className="bible-text">{verse.content}</p>
                <div className="flex justify-end gap-2 mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleShare(verse)}
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Compartilhar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(verse.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Você ainda não tem versículos destacados.
        </div>
      )}
    </div>
  );
};

export default HighlightedVerses;
