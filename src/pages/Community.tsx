
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, User, PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import CommunitySearch from '@/components/community/CommunitySearch';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  comments_count: number;
  likes_count: number;
  created_at: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string | null;
}

const CommunityPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Buscar postagens do Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Modificando a consulta para lidar com o related data differently
        const { data, error } = await supabase
          .from('community_posts')
          .select(`
            id,
            title,
            content,
            category,
            comments_count,
            likes_count,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        // Buscar informações de perfil para cada post
        const postsWithProfiles = await Promise.all(
          (data || []).map(async (post) => {
            // Buscar perfil do usuário separadamente
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', post.user_id)
              .single();

            if (profileError) {
              console.warn(`Error fetching profile for user ${post.user_id}:`, profileError.message);
              return {
                ...post,
                user_name: 'Usuário',
                user_avatar: null
              };
            }

            return {
              ...post,
              user_name: profileData?.username || 'Usuário',
              user_avatar: profileData?.avatar_url
            };
          })
        );

        setPosts(postsWithProfiles);
      } catch (error: any) {
        console.error('Erro ao buscar postagens:', error.message);
        toast({
          title: "Erro ao carregar postagens",
          description: "Houve um problema ao buscar as postagens da comunidade.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('community_categories')
          .select('*')
          .order('name');

        if (error) {
          throw error;
        }

        setCategories(data || []);
      } catch (error: any) {
        console.error('Erro ao buscar categorias:', error.message);
      }
    };

    fetchPosts();
    fetchCategories();
  }, [toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Hoje";
    } else if (diffDays === 1) {
      return "Ontem";
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const handleNewPostClick = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Você precisa estar logado para criar uma nova discussão.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    // Em um cenário real, navegaria para a página de criação de post
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de postagens estará disponível em breve."
    });
  };

  return (
    <Layout>
      <div className="container py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Comunidade</h1>
          <div className="flex items-center gap-4">
            <CommunitySearch />
            <Button onClick={handleNewPostClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Discussão
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-semibold">Discussões Recentes</h2>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <p>Carregando discussões...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <Badge className="mb-2">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">{formatDate(post.created_at)}</span>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-biblia-blue-100 text-biblia-blue-700">
                          {post.user_name ? post.user_name.substring(0, 2).toUpperCase() : "UN"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.user_name || "Usuário"}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-4">
                      <span className="flex items-center text-sm text-muted-foreground">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {post.likes_count}
                      </span>
                      <span className="flex items-center text-sm text-muted-foreground">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {post.comments_count}
                      </span>
                    </div>
                    <Button variant="outline" onClick={() => navigate(`/community/post/${post.id}`)}>Ver Discussão</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Nenhuma discussão encontrada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Seja o primeiro a iniciar uma discussão na comunidade!</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleNewPostClick}>Criar Nova Discussão</Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Canais Populares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <Badge>0 posts</Badge>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-muted-foreground">Nenhuma categoria disponível</p>
                )}
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
