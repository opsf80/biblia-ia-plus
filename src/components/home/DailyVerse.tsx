
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";

const verses = [
  {
    text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    translation: "NVI"
  },
  {
    text: "O Senhor é o meu pastor, nada me faltará.",
    reference: "Salmos 23:1",
    translation: "ARC"
  },
  {
    text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
    reference: "Salmos 37:5",
    translation: "ARC"
  },
  {
    text: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13",
    translation: "ARC"
  }
];

const DailyVerse = () => {
  const [verse, setVerse] = useState<typeof verses[0]>(verses[0]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll just pick a random verse from our array
    const randomIndex = Math.floor(Math.random() * verses.length);
    setVerse(verses[randomIndex]);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Versículo do dia',
        text: `${verse.text} - ${verse.reference} (${verse.translation})`,
        url: window.location.href,
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Versículo do dia</CardTitle>
        <CardDescription>Uma palavra para inspirar sua jornada</CardDescription>
      </CardHeader>
      <CardContent>
        <blockquote className="border-l-4 border-biblia-purple-500 pl-4 italic">
          <p className="bible-text">{verse.text}</p>
          <footer className="mt-2 font-bold text-biblia-blue-500">
            {verse.reference} ({verse.translation})
          </footer>
        </blockquote>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyVerse;
