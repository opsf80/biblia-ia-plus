
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const PremiumPlansPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Você precisa estar logado para acessar os planos premium.</p>
          <Button onClick={() => navigate('/auth')}>Entrar / Cadastrar</Button>
        </div>
      </Layout>
    );
  }

  const handleSelectPlan = async (planType: string) => {
    if (!user) {
      toast({
        title: "É necessário fazer login",
        description: "Por favor, faça login ou crie uma conta para assinar um plano.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setSelectedPlan(planType);
    
    // Em um cenário real, aqui você iria para a página de pagamento
    // Por enquanto, só vamos simular a assinatura ao adicionar no Supabase
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([
          { 
            user_id: user.id,
            plan_type: planType
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Plano selecionado com sucesso!",
        description: `Você assinou o plano ${planType === 'monthly' ? 'mensal' : 'anual'}.`,
      });
      
      // Redirecionar para a página principal
      setTimeout(() => navigate('/bible'), 2000);
    } catch (error: any) {
      toast({
        title: "Erro ao selecionar plano",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Escolha seu Plano Premium</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesse recursos exclusivos, planos de estudo avançados e desbloqueie todo o potencial da plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Mensal */}
          <Card className={`border-2 ${selectedPlan === 'monthly' ? 'border-biblia-purple-500' : 'border-transparent'} transition-all hover:shadow-lg`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Plano Mensal</CardTitle>
                  <CardDescription>Acesso flexível, renovado mensalmente</CardDescription>
                </div>
                <Badge>Popular</Badge>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">R$9,90</span>
                <span className="text-muted-foreground ml-1">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Acesso completo a todos os planos de estudo</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Consultas ilimitadas ao assistente de IA</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Comparação de versões bíblicas</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Ferramentas de estudo avançadas</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelectPlan('monthly')} 
                className="w-full bg-gradient-to-r from-biblia-purple-500 to-biblia-blue-500"
                disabled={isLoading}
              >
                {isLoading && selectedPlan === 'monthly' ? 'Processando...' : 'Escolher Plano'}
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Anual */}
          <Card className={`border-2 ${selectedPlan === 'yearly' ? 'border-biblia-purple-500' : 'border-transparent'} transition-all hover:shadow-lg`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Plano Anual</CardTitle>
                  <CardDescription>Melhor custo-benefício</CardDescription>
                </div>
                <Badge variant="outline" className="bg-biblia-purple-100 text-biblia-purple-800 border-biblia-purple-200">Economize 16%</Badge>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">R$99,90</span>
                <span className="text-muted-foreground ml-1">/ano</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Todos os benefícios do plano mensal</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Economize 16% em relação ao plano mensal</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Acesso antecipado a novos recursos</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>2 e-books exclusivos sobre estudos bíblicos</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelectPlan('yearly')} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && selectedPlan === 'yearly' ? 'Processando...' : 'Escolher Plano'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PremiumPlansPage;
