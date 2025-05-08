
import { useState, useEffect } from 'react';
import { bibleService, BIBLE_VERSIONS } from '@/services/bible';
import { BibleBook, BibleChapter, BibleVerse } from '@/services/bible/types';
import { useToast } from '@/hooks/use-toast';
import { useImportBible } from './useImportBible';

export const useBibleData = () => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('João');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVersion, setSelectedVersion] = useState<string>(BIBLE_VERSIONS.BLFPT.id);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [chapters, setChapters] = useState<BibleChapter[]>([]);
  const [maxChapters, setMaxChapters] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { isImporting, importBooks, importChapters, importVerses } = useImportBible();

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

  const fetchChapters = async () => {
    setIsLoading(true);
    try {
      const chaptersData = await bibleService.getChapters(selectedVersion, selectedBookId);
      
      if (chaptersData.length === 0) {
        // Se não encontrar no Supabase, importar os capítulos
        await importChapters(selectedVersion, selectedBookId);
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
        await importVerses(selectedVersion, chapterId);
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

  return {
    books,
    selectedBook,
    setSelectedBook,
    selectedBookId,
    selectedChapter,
    setSelectedChapter,
    selectedVersion,
    setSelectedVersion,
    verses,
    chapters,
    maxChapters,
    isLoading,
    isImporting
  };
};
