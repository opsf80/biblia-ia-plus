
import React, { useState } from 'react';
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
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Sample Bible content (in a real app this would be fetched from an API)
const SAMPLE_JOHN_1 = {
  book: "João",
  chapter: 1,
  verses: [
    "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
    "Ele estava no princípio com Deus.",
    "Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.",
    "Nele estava a vida, e a vida era a luz dos homens.",
    "E a luz resplandece nas trevas, e as trevas não a compreenderam.",
    "Houve um homem enviado de Deus, cujo nome era João.",
    "Este veio para testemunho, para que testificasse da luz, para que todos cressem por ele.",
    "Não era ele a luz, mas para que testificasse da luz.",
    "Ali estava a luz verdadeira, que ilumina a todo o homem que vem ao mundo.",
    "Estava no mundo, e o mundo foi feito por ele, e o mundo não o conheceu."
  ],
  translations: ["ARC", "NVI", "NAA"]
};

const BIBLE_BOOKS = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
  "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel", 
  "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras",
  "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
  "Eclesiastes", "Cantares", "Isaías", "Jeremias", "Lamentações",
  "Ezequiel", "Daniel", "Oséias", "Joel", "Amós",
  "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque",
  "Sofonias", "Ageu", "Zacarias", "Malaquias",
  "Mateus", "Marcos", "Lucas", "João", "Atos",
  "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
  "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo",
  "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago",
  "1 Pedro", "2 Pedro", "1 João", "2 João", "3 João",
  "Judas", "Apocalipse"
];

const BibleReader = () => {
  const [selectedBook, setSelectedBook] = useState("João");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState("ARC");
  
  const maxChapters = 21; // For John, would be dynamic in a real app
  
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
                {BIBLE_BOOKS.map((book) => (
                  <SelectItem key={book} value={book}>{book}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={selectedChapter.toString()} onValueChange={(value) => setSelectedChapter(parseInt(value))}>
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
          
          <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Versão" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Versão</SelectLabel>
                {SAMPLE_JOHN_1.translations.map((translation) => (
                  <SelectItem key={translation} value={translation}>{translation}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <div className="flex gap-1 ml-auto">
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
            {SAMPLE_JOHN_1.verses.map((verse, index) => (
              <p key={index} className="flex">
                <span className="verse-number">{index + 1}</span>
                <span>{verse}</span>
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleReader;
