
import React from 'react';
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
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BibleBook, BibleChapter } from '@/services/bible/types';
import { BIBLE_VERSIONS } from '@/services/bible';

interface BibleControlsProps {
  books: BibleBook[];
  selectedBook: string;
  setSelectedBook: (book: string) => void;
  selectedChapter: number;
  setSelectedChapter: (chapter: number) => void;
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  maxChapters: number;
  isLoading: boolean;
  isImporting: boolean;
}

const BibleControls: React.FC<BibleControlsProps> = ({
  books,
  selectedBook,
  setSelectedBook,
  selectedChapter,
  setSelectedChapter,
  selectedVersion,
  setSelectedVersion,
  maxChapters,
  isLoading,
  isImporting
}) => {
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
  );
};

export default BibleControls;
