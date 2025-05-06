
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, BookOpen, Share, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';
import { contentService, SIMPLE_TRANSLATIONS } from '@/services/bible';
import { useAuth } from '@/hooks/use-auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HighlightColor } from '@/services/bible/types';
import { useState as useHookState } from '@hookform/resolvers/zod';

interface SimpleVerseSearchProps {
  onVerseSelect?: (verse: any) => void;
}

export const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
  'yellow': 'bg-yellow-200',
  'green': 'bg-green-200',
  'blue': 'bg-blue-200',
  'pink': 'bg-pink-200',
  'purple': 'bg-purple-200'
};

const SimpleVerseSearch: React.FC<SimpleVerseSearchProps> = ({ onVerseSelect }) => {
  const [reference, setReference] = useState('');
  const [translation, setTranslation] = useState('almeida');
  const [isLoading, setIsLoading] = useState(false);
  const [verseResult, setVerseResult] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reference.trim()) return;
    
    setIsLoading(true);
    
    try {
      const data = await contentService.getSimpleVerse(reference, translation);
      
      if (data.error) {
        toast.error(data.error);
        setVerseResult(null);
      } else {
        setVerseResult(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar versículo.");
      setVerseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFavorite = async () => {
    if (!user) {
      toast.warning("Faça login para salvar versículos favoritos", {
        action: {
          label: "Entrar",
          onClick: () => window.location.href = "/auth"
        }
      });
      return;
    }
    
    if (verseResult) {
      try {
        const success = await contentService.saveFavoriteVerse({
          id: `simple-${Date.now()}`,
          reference: verseResult.reference,
          content: verseResult.text
        }, 
        SIMPLE_TRANSLATIONS[translation.toUpperCase()]?.abbreviation || translation);
        
        if (success) {
          setIsFavorited(true);
          toast.success("Versículo salvo como favorito");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar versículo favorito");
      }
    }
  };

  const handleHighlight = async (color: HighlightColor) => {
    if (!user) {
      toast.warning("Faça login para destacar versículos", {
        action: {
          label: "Entrar",
          onClick: () => window.location.href = "/auth"
        }
      });
      return;
    }
    
    if (verseResult) {
      try {
        const success = await contentService.highlightVerse(
          `simple-${Date.now()}`,
          verseResult.reference,
          verseResult.text,
          color
        );
        
        if (success) {
          toast.success(`Versículo destacado com cor ${color}`);
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao destacar versículo");
      }
    }
  };

  const handleShare = () => {
    if (verseResult) {
      const shareText = `${verseResult.text} - ${verseResult.reference} (${SIMPLE_TRANSLATIONS[translation.toUpperCase()]?.abbreviation || translation})`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Versículo Bíblico',
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
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Select 
          value={translation} 
          onValueChange={setTranslation}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Versão" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SIMPLE_TRANSLATIONS).map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.abbreviation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Digite a referência (ex: João 3:16)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
          <span className="ml-2 hidden md:inline">Buscar</span>
        </Button>
      </form>

      {verseResult && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="flex items-center justify-between">
              <span>{verseResult.reference}</span>
              <span className="text-xs text-muted-foreground">
                {SIMPLE_TRANSLATIONS[translation.toUpperCase()]?.abbreviation || translation.toUpperCase()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="bible-text text-lg">{verseResult.text}</p>
          </CardContent>
          <CardFooter className="py-2 flex justify-end gap-2 border-t">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Destacar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <ToggleGroup type="single" className="flex gap-1">
                  {Object.entries(HIGHLIGHT_COLORS).map(([color, bgClass]) => (
                    <ToggleGroupItem
                      key={color}
                      value={color}
                      aria-label={`Destacar com cor ${color}`}
                      className={`w-8 h-8 rounded-full ${bgClass}`}
                      onClick={() => handleHighlight(color as HighlightColor)}
                    />
                  ))}
                </ToggleGroup>
              </PopoverContent>
            </Popover>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSaveFavorite}
              disabled={!user || isFavorited}
            >
              {isFavorited ? (
                <BookmarkCheck className="h-4 w-4 mr-1" />
              ) : (
                <BookmarkPlus className="h-4 w-4 mr-1" />
              )}
              {isFavorited ? 'Salvo' : 'Salvar'}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
            >
              <Share className="h-4 w-4 mr-1" />
              Compartilhar
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SimpleVerseSearch;
