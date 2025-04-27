
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import WelcomeCard from '@/components/home/WelcomeCard';
import FeatureCard from '@/components/home/FeatureCard';
import DailyVerse from '@/components/home/DailyVerse';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, Star, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const IndexPage = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    setShowOnboarding(!onboardingComplete);
    
    // Redirect authenticated users to Bible page
    if (user) {
      navigate('/bible');
    }
  }, [user, navigate]);

  if (showOnboarding) {
    return (
      <Layout>
        <div className="container max-w-md py-8">
          <WelcomeCard />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-biblia-purple-500 to-biblia-blue-500 bg-clip-text text-transparent">
            BíbliaIA+
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seu mentor bíblico pessoal, combinando teologia confiável com inteligência artificial avançada.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Entrar
            </Button>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Recursos Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="IA Teológica"
              description="Faça perguntas sobre a Bíblia e receba respostas baseadas nas Escrituras e em comentários teológicos."
              icon={<MessageSquare className="h-6 w-6" />}
            />
            <FeatureCard
              title="Leitura Bíblica"
              description="Compare traduções em tempo real e explore a Bíblia com ferramentas de estudo avançadas."
              icon={<BookOpen className="h-6 w-6" />}
            />
            <FeatureCard
              title="Planos de Estudo"
              description="Acompanhe seu progresso com planos interativos e ganhe recompensas pela sua dedicação."
              icon={<Star className="h-6 w-6" />}
            />
            <FeatureCard
              title="Comunidade"
              description="Conecte-se com outros cristãos, participe de discussões e compartilhe suas reflexões."
              icon={<Users className="h-6 w-6" />}
            />
          </div>
        </section>
        
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Pergunta do Dia</h2>
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">O que significa Romanos 8:28?</h3>
                <p className="text-muted-foreground mb-4">
                  Explore o significado deste versículo poderoso sobre como Deus trabalha todas as coisas para o bem daqueles que o amam.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth')}
                >
                  Faça login para responder
                </Button>
              </div>
            </div>
            <DailyVerse />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default IndexPage;
