
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio do formulário
    setTimeout(() => {
      toast({
        title: "Mensagem enviada com sucesso",
        description: "Agradecemos seu contato. Responderemos em breve!",
      });
      setIsSubmitting(false);
      
      // Limpar formulário
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1500);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Entre em Contato</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <div>
            <p className="mb-6 text-lg">
              Estamos sempre à disposição para ouvir suas dúvidas, sugestões e comentários. 
              Preencha o formulário abaixo e nossa equipe entrará em contato com você o mais breve possível.
            </p>
          
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="name">Nome</FormLabel>
                  <Input id="name" name="name" placeholder="Seu nome completo" required />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input id="email" name="email" type="email" placeholder="seu.email@exemplo.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel htmlFor="subject">Assunto</FormLabel>
                <Input id="subject" name="subject" placeholder="Assunto da mensagem" required />
              </div>
              <div className="space-y-2">
                <FormLabel htmlFor="message">Mensagem</FormLabel>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Digite sua mensagem aqui..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </form>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Outras Formas de Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-muted-foreground">contato@bibliaai.com.br</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Suporte</h3>
                <p className="text-muted-foreground">suporte@bibliaai.com.br</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
