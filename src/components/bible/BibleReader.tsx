import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Book, BibleVersion, Verse } from '@/types/bible';
import { useToast } from '@/hooks/use-toast';

const BibleReader = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('João');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('ARC');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [maxChapters, setMaxChapters] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
    fetchVersions();
  }, []);

  useEffect(() => {
    fetchChapters();
    fetchVerses();
  }, [selectedBook, selectedChapter, selectedTranslation]);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('livros')
      .select('*')
      .order('posicao');

    if (error) {
      toast({
        title: "Erro ao carregar livros",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setBooks(data as Book[]);
    }
  };

  const fetchVersions = async () => {
    const { data, error } = await supabase
      .from('versoes_biblia')
      .select('*');

    if (error) {
      toast({
        title: "Erro ao carregar versões",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setVersions(data as BibleVersion[]);
    }
  };

  const fetchChapters = async () => {
    const { data, error } = await supabase
      .from('livros')
      .select('id')
      .eq('nome', selectedBook)
      .single();

    if (data) {
      const { count, error: chapterError } = await supabase
        .from('capitulos')
        .select('*', { count: 'exact' })
        .eq('livro_id', data.id);

      if (chapterError) {
        toast({
          title: "Erro ao carregar capítulos",
          description: chapterError.message,
          variant: "destructive"
        });
      } else {
        setMaxChapters(count || 1);
      }
    }
  };

  const fetchVerses = async () => {
    const { data: bookData, error: bookError } = await supabase
      .from('livros')
      .select('id')
      .eq('nome', selectedBook)
      .single();

    if (bookData) {
      const { data: versesData, error } = await supabase
        .from('versiculos')
        .select(`
          id, 
          numero, 
          texto, 
          capitulo: capitulos(id, numero, livro_id),
          versao: versoes_biblia(sigla)
        `)
        .eq('capitulo.livro_id', bookData.id)
        .eq('capitulo.numero', selectedChapter)
        .eq('versao.sigla', selectedTranslation);

      if (error) {
        toast({
          title: "Erro ao carregar versículos",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setVerses(versesData as unknown as Verse[]);
      }
    }
  };

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };
  
  const handleNextChapter = () => {
    if (selectedChapter < maxChapters) {
      setSelectedChapter(selectedChapter + 1);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 border-b">
        <div className="flex flex-wrap gap-2">
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Livro" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Livros da Bíblia</SelectLabel>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.nome}>
                    {book.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedChapter.toString()} 
            onValueChange={(value) => setSelectedChapter(parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Capítulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Capítulo</SelectLabel>
                {Array.from({ length: maxChapters }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedTranslation} 
            onValueChange={setSelectedTranslation}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Versão" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Versão</SelectLabel>
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.sigla}>
                    {version.sigla}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousChapter}
              disabled={selectedChapter <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Capítulo anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextChapter}
              disabled={selectedChapter >= maxChapters}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próximo capítulo</span>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/bible/search">
                <Search className="h-4 w-4 mr-2" />
                <span>Pesquisar</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="mt-4 border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-baseline">
            <span className="text-2xl font-bold">{selectedBook}</span>
            <span className="chapter-number ml-2">{selectedChapter}</span>
            <span className="ml-auto text-sm text-muted-foreground">{selectedTranslation}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bible-text space-y-4">
            {verses.map((verse) => (
              <p key={verse.id} className="flex">
                <span className="verse-number mr-2 text-muted-foreground">{verse.numero}</span>
                <span>{verse.texto}</span>
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleReader;
