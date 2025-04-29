
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BookOpen, Search, Heart } from 'lucide-react';
import { toast } from "sonner";
import { bibleService, BibleVerse, BIBLE_VERSIONS } from "@/services/bibleService";
import { useAuth } from "@/hooks/use-auth";

interface VerseSearchProps {
  onVerseSelect?: (verse: BibleVerse, version: string) => void;
}

const VerseSearch: React.FC<VerseSearchProps> = ({ onVerseSelect }) => {
  const [query, setQuery] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(BIBLE_VERSIONS.BLFPT.id);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BibleVerse[]>([]);
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Verificar se é uma referência específica (ex: João 3:16)
      const referenceRegex = /^([1-3]?\s?[A-Za-záàâãéèêíïóôõöúçñ]+)\s+(\d+)(?::(\d+))?$/i;
      const match = query.match(referenceRegex);
      
      if (match) {
        // É uma referência específica
        const [_, book, chapter, verse] = match;
        const passageId = verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;
        
        const result = await bibleService.getPassage(selectedVersion, passageId);
        
        if (result) {
          setResults([result]);
        } else {
          setResults([]);
          toast.error("Referência bíblica não encontrada");
        }
      } else {
        // É uma busca por palavra-chave
        const searchResult = await bibleService.searchVerses(selectedVersion, query);
        setResults(searchResult.verses);
        
        if (searchResult.verses.length === 0) {
          toast.info("Nenhum resultado encontrado para esta busca");
        } else {
          toast.success(`Encontrados ${searchResult.verses.length} resultados`);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar versículos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFavorite = async (verse: BibleVerse) => {
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
      const success = await bibleService.saveFavoriteVerse(verse, selectedVersion);
      
      if (success) {
        toast.success("Versículo salvo como favorito");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar versículo favorito");
    }
  };

  const handleVerseSelect = (verse: BibleVerse) => {
    if (onVerseSelect) {
      onVerseSelect(verse, 
        Object.values(BIBLE_VERSIONS).find(v => v.id === selectedVersion)?.abbreviation || "BLFPT"
      );
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Select 
          value={selectedVersion} 
          onValueChange={setSelectedVersion}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Versão" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BIBLE_VERSIONS).map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.abbreviation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar versículos ou referência (ex: João 3:16)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-2 hidden md:inline">Buscar</span>
        </Button>
      </form>

      <div className="space-y-4">
        {results.map((verse) => (
          <Card key={verse.id} className="overflow-hidden">
            <CardHeader className="py-3 bg-muted/30">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>{verse.reference}</span>
                <span className="text-xs text-muted-foreground">
                  {Object.values(BIBLE_VERSIONS).find(v => v.id === selectedVersion)?.abbreviation || "BLFPT"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <p className="bible-text text-base">{verse.content}</p>
            </CardContent>
            <CardFooter className="py-2 flex justify-end gap-2 border-t">
              {onVerseSelect && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleVerseSelect(verse)}
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Selecionar
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSaveFavorite(verse)}
                disabled={!user}
              >
                <Heart className="h-4 w-4 mr-1" />
                Favorito
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {query && !isLoading && results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum resultado encontrado para "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default VerseSearch;
