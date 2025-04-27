
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const TUTORIAL_STEPS = [
  {
    title: "Bem-vindo ao BíbliaIA+",
    description: "Seu mentor bíblico pessoal, combinando teologia confiável com inteligência artificial avançada.",
    image: "/tutorial-1.png"
  },
  {
    title: "Faça perguntas sobre a Bíblia",
    description: "Nossa IA está treinada com comentários teológicos e versículos para responder suas dúvidas com precisão.",
    image: "/tutorial-2.png"
  },
  {
    title: "Estude com planos personalizados",
    description: "Acompanhe seu progresso com planos de estudo interativos e ganhe recompensas por sua dedicação.",
    image: "/tutorial-3.png"
  }
];

const WelcomeCard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const handleNextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish onboarding and redirect to chat
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/chat');
    }
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="relative w-full h-48 bg-gradient-to-r from-biblia-purple-500 to-biblia-blue-500">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {/* Placeholder for image - in a real app, use actual illustrations */}
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <span className="text-5xl">🙏</span>
          </div>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-center text-2xl">{step.title}</CardTitle>
        <CardDescription className="text-center">{step.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex justify-center">
        <div className="flex space-x-2 my-2">
          {TUTORIAL_STEPS.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-biblia-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          className="bg-gradient-to-r from-biblia-purple-500 to-biblia-blue-500 hover:opacity-90"
          onClick={handleNextStep}
        >
          {currentStep < TUTORIAL_STEPS.length - 1 ? "Próximo" : "Começar"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WelcomeCard;
