
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { versionService } from '@/services/bible';
import { useToast } from '@/hooks/use-toast';

type BookItem = {
  id: string;
  name: string;
  testament: string;
};

const BibleBookList = () => {
  const [ptBooks, setPtBooks] = useState<BookItem[]>([]);
  const [enBooks, setEnBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      // Get Portuguese books
      const ptData = await versionService.getBibleBooks('pt');
      setPtBooks(ptData);

      // Get English books
      const enData = await versionService.getBibleBooks('en');
      setEnBooks(enData);
    } catch (error) {
      console.error('Error fetching Bible books:', error);
      toast({
        title: "Erro ao carregar livros",
        description: "Não foi possível carregar a lista de livros da Bíblia.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupBooksByTestament = (books: BookItem[]) => {
    const oldTestament = books.filter(book => book.testament === 'Antigo');
    const newTestament = books.filter(book => book.testament === 'Novo');
    return { oldTestament, newTestament };
  };

  const renderBookList = (books: BookItem[]) => {
    const { oldTestament, newTestament } = groupBooksByTestament(books);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Antigo Testamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-2">
              {oldTestament.map((book) => (
                <li key={book.id} className="p-2 rounded hover:bg-muted transition-colors">
                  {book.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Novo Testamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-2">
              {newTestament.map((book) => (
                <li key={book.id} className="p-2 rounded hover:bg-muted transition-colors">
                  {book.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-pulse text-center">
          <p>Carregando livros da Bíblia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="pt">
        <TabsList className="mb-4">
          <TabsTrigger value="pt">Português</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>
        <TabsContent value="pt">
          {renderBookList(ptBooks)}
        </TabsContent>
        <TabsContent value="en">
          {renderBookList(enBooks)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BibleBookList;
