import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  category: string;
}

const CommunitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('id, title, category')
        .ilike('title', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setResults(data || []);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 md:w-60 justify-start text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span>Pesquisar na comunidade...</span>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Digite para pesquisar nas postagens..." 
          value={query}
          onValueChange={(text) => {
            setQuery(text);
            handleSearch(text);
          }}
        />
        <CommandList>
          {isSearching && (
            <div className="py-6 text-center text-sm">Pesquisando...</div>
          )}
          
          {!isSearching && (
            <>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup heading="Resultados">
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => {
                      setOpen(false);
                      navigate(`/community/post/${result.id}`);
                    }}
                  >
                    <div>
                      <p>{result.title}</p>
                      <p className="text-sm text-muted-foreground">{result.category}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CommunitySearch;
