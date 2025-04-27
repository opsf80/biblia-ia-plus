
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Star } from 'lucide-react';

const plans = [
  {
    id: 1,
    title: "21 Dias de Oração",
    description: "Um plano diário para desenvolver sua vida de oração com base em ensinamentos bíblicos.",
    category: "Devoção",
    progress: 35,
    free: true,
    image: "prayer.jpg"
  },
  {
    id: 2,
    title: "Fundamentos da Fé",
    description: "Entenda os pilares fundamentais da fé cristã através da Palavra de Deus.",
    category: "Estudo",
    progress: 0,
    free: true,
    image: "foundations.jpg"
  },
  {
    id: 3,
    title: "Bíblia para Casais",
    description: "Estudo especial para casais construírem um relacionamento baseado em princípios bíblicos.",
    category: "Relacionamento",
    progress: 0,
    free: false,
    image: "couples.jpg"
  },
  {
    id: 4,
    title: "Salmos em 30 Dias",
    description: "Mergulhe no livro dos Salmos com reflexões diárias e aplicações práticas.",
    category: "Leitura",
    progress: 0,
    free: false,
    image: "psalms.jpg"
  }
];

const PlansPage = () => {
  return (
    <Layout>
      <div className="container py-4">
        <h1 className="text-2xl font-bold mb-4">Planos de Estudo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-biblia-purple-400 to-biblia-blue-400 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Star className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{plan.title}</CardTitle>
                  <Badge variant={plan.free ? "default" : "outline"} className={plan.free ? "bg-biblia-purple-500" : ""}>
                    {plan.free ? "Gratuito" : "Premium"}
                  </Badge>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm text-muted-foreground">{plan.progress}%</span>
                </div>
                <Progress value={plan.progress} className="h-2" />
              </CardContent>
              <CardFooter>
                {plan.free ? (
                  <Button className="w-full">Iniciar Plano</Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    <Lock className="mr-2 h-4 w-4" />
                    Upgrade para Premium
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PlansPage;
