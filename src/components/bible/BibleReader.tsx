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
import { useToast } from '@/hooks/use-toast';
import { bibleService, BIBLE_VERSIONS } from '@/services/bible';
import { BibleBook, BibleChapter, BibleVerse } from '@/services/bible/types';
import { supabase } from '@/integrations/supabase/client';

const BibleReader = () => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('João');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVersion, setSelectedVersion] = useState<string>(BIBLE_VERSIONS.BLFPT.id);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [chapters, setChapters] = useState<BibleChapter[]>([]);
  const [maxChapters, setMaxChapters] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, [selectedVersion]);

  useEffect(() => {
    if (books.length > 0) {
      const foundBook = books.find(book => book.name === selectedBook);
      if (foundBook) {
        setSelectedBookId(foundBook.id);
      }
    }
  }, [selectedBook, books]);

  useEffect(() => {
    if (selectedBookId) {
      fetchChapters();
    }
  }, [selectedBookId, selectedVersion]);

  useEffect(() => {
    if (selectedBookId && chapters.length > 0) {
      fetchVerses();
    }
  }, [selectedBookId, selectedChapter, selectedVersion, chapters]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      // Buscar livros
      const booksData = await bibleService.getBooks(selectedVersion);
      
      if (booksData.length === 0) {
        // Se não encontrar, importar os livros
        await importBooks();
        // Buscar novamente após importação
        const newBooksData = await bibleService.getBooks(selectedVersion);
        setBooks(newBooksData);
      } else {
        setBooks(booksData);
      }
      
      // Encontrar João ou usar o primeiro livro
      const johnBook = booksData.find(book => 
        book.name === 'João' || book.name === 'John' || book.name === 'João'
      );
      
      if (johnBook) {
        setSelectedBook(johnBook.name);
        setSelectedBookId(johnBook.id);
      } else if (booksData.length > 0) {
        setSelectedBook(booksData[0].name);
        setSelectedBookId(booksData[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      toast({
        title: "Erro ao carregar livros",
        description: "Não foi possível carregar a lista de livros.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          bibleId: selectedVersion
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
    } finally {
      setIsImporting(false);
    }
  };

  const fetchChapters = async () => {
    setIsLoading(true);
    try {
      const chaptersData = await bibleService.getChapters(selectedVersion, selectedBookId);
      
      if (chaptersData.length === 0) {
        // Se não encontrar no Supabase, importar os capítulos
        await importChapters();
        // Buscar novamente após importação
        const newChaptersData = await bibleService.getChapters(selectedVersion, selectedBookId);
        setChapters(newChaptersData);
        setMaxChapters(newChaptersData.length);
      } else {
        setChapters(chaptersData);
        setMaxChapters(chaptersData.length);
      }
      
      // Resetar para o capítulo 1 quando mudar de livro
      setSelectedChapter(1);
    } catch (error) {
      console.error('Erro ao buscar capítulos:', error);
      toast({
        title: "Erro ao carregar capítulos",
        description: "Não foi possível carregar os capítulos deste livro.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const importChapters = async () => {
    setIsImporting(true);
    try {
      toast({
        title: "Importando capítulos",
        description: "Aguarde enquanto importamos os capítulos..."
      });
      
      const { data, error } = await supabase.functions.invoke('bible-import', {
        body: { 
          action: 'import_chapters',
          bibleId: selectedVersion,
          bookId: selectedBookId
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
    } finally {
      setIsImporting(false);
    }
  };

  const fetchVerses = async () => {
    setIsLoading(true);
    try {
      if (chapters.length === 0) return;
      
      const chapterId = chapters.find(ch => Number(ch.number) === selectedChapter)?.id;
      if (!chapterId) {
        console.error('Chapter ID não encontrado para', selectedChapter);
        return;
      }
      
      const versesData = await bibleService.getVerses(selectedVersion, chapterId);
      
      if (versesData.length === 0) {
        // Se não encontrar no Supabase, importar os versículos
        await importVerses(chapterId);
        // Buscar novamente após importação
        const newVersesData = await bibleService.getVerses(selectedVersion, chapterId);
        setVerses(newVersesData);
      } else {
        setVerses(versesData);
      }
    } catch (error) {
      console.error('Erro ao buscar versículos:', error);
      toast({
        title: "Erro ao carregar versículos",
        description: "Não foi possível carregar os versículos deste capítulo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const importVerses = async (chapterId: string) => {
    setIsImporting(true);
    try {
      toast({
        title: "Importando versículos",
        description: "Aguarde enquanto importamos os versículos..."
      });
      
      const { data, error } = await supabase.functions.invoke('bible-import', {
        body: { 
          action: 'import_verses',
          bibleId: selectedVersion,
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
    } finally {
      setIsImporting(false);
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

  const getVersionName = () => {
    const version = Object.values(BIBLE_VERSIONS).find(v => v.id === selectedVersion);
    return version?.abbreviation || '';
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
                  <SelectItem key={book.id} value={book.name}>
                    {book.name}
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
            value={selectedVersion} 
            onValueChange={setSelectedVersion}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Versão" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Versão</SelectLabel>
                {Object.values(BIBLE_VERSIONS).map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.abbreviation}
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
              disabled={selectedChapter <= 1 || isLoading || isImporting}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Capítulo anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextChapter}
              disabled={selectedChapter >= maxChapters || isLoading || isImporting}
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
            <span className="ml-auto text-sm text-muted-foreground">{getVersionName()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isImporting ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse text-center">
                <p>Carregando...</p>
              </div>
            </div>
          ) : (
            <div className="bible-text space-y-4">
              {verses.length > 0 ? (
                verses.map((verse) => (
                  <p key={verse.id} className="flex">
                    <span className="verse-number mr-2 text-muted-foreground">
                      {verse.reference ? verse.reference.split(':')[1] : verse.number}
                    </span>
                    <span>{verse.content || verse.text}</span>
                  </p>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Não foram encontrados versículos para este capítulo.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleReader;
