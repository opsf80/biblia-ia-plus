
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, User } from 'lucide-react';

const discussions = [
  {
    id: 1,
    title: "Como interpretar Apocalipse 20?",
    author: "João Silva",
    date: "Hoje",
    comments: 12,
    likes: 8,
    category: "Estudo Bíblico",
    excerpt: "Gostaria de entender melhor o significado do milênio mencionado em Apocalipse 20 e as diferentes interpretações teológicas."
  },
  {
    id: 2,
    title: "Testemunho: Como Deus mudou minha vida",
    author: "Maria Santos",
    date: "Ontem",
    comments: 24,
    likes: 45,
    category: "Testemunhos",
    excerpt: "Quero compartilhar como encontrei Cristo em um momento difícil e como minha vida foi completamente transformada."
  },
  {
    id: 3,
    title: "Pergunte ao Pastor: Dízimos e Ofertas",
    author: "Pr. Roberto",
    date: "2 dias atrás",
    comments: 32,
    likes: 17,
    category: "Pergunte ao Pastor",
    excerpt: "Neste vídeo, respondo às principais dúvidas sobre o que a Bíblia realmente ensina sobre dízimos e ofertas."
  }
];

const CommunityPage = () => {
  return (
    <Layout>
      <div className="container py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Comunidade</h1>
          <Button>Nova Discussão</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-semibold">Discussões Recentes</h2>
            
            {discussions.map((discussion) => (
              <Card key={discussion.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <Badge className="mb-2">{discussion.category}</Badge>
                    <span className="text-sm text-muted-foreground">{discussion.date}</span>
                  </div>
                  <CardTitle>{discussion.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-biblia-blue-100 text-biblia-blue-700">
                        {discussion.author.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{discussion.author}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{discussion.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-4">
                    <span className="flex items-center text-sm text-muted-foreground">
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      {discussion.likes}
                    </span>
                    <span className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {discussion.comments}
                    </span>
                  </div>
                  <Button variant="outline">Ver Discussão</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Canais Populares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Estudo Bíblico</span>
                  <Badge>124 posts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Testemunhos</span>
                  <Badge>87 posts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pergunte ao Pastor</span>
                  <Badge>56 posts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quiz Bíblico</span>
                  <Badge>43 posts</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver Todos os Canais</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quiz do Mês</CardTitle>
                <CardDescription>Participe e teste seus conhecimentos bíblicos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 space-y-4">
                  <div className="w-20 h-20 bg-biblia-purple-100 dark:bg-biblia-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <h3 className="font-semibold">Personagens do Antigo Testamento</h3>
                  <p className="text-sm text-muted-foreground">10 perguntas · Prêmio: E-book gratuito</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-biblia-purple-500 to-biblia-blue-500 hover:opacity-90">
                  Participar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
