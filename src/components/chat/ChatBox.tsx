import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";
import ChatMessage from './ChatMessage';
import { toast } from 'sonner';

// Types for our chat
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Sample AI responses for demonstration
const AI_RESPONSES = [
  {
    question: "o que é pecado original?",
    answer: "O pecado original refere-se à doutrina cristã sobre a natureza caída da humanidade após a desobediência de Adão e Eva no Jardim do Éden (Gênesis 3). Esta doutrina ensina que todos os seres humanos nascem em estado de pecado herdado dessa primeira transgressão.\n\nPassagens bíblicas relevantes incluem:\n\n- **Romanos 5:12**: \"Portanto, assim como por um só homem entrou o pecado no mundo, e pelo pecado, a morte, assim também a morte passou a todos os homens, porque todos pecaram.\"\n\n- **Salmos 51:5**: \"Eis que em iniquidade fui formado, e em pecado me concebeu minha mãe.\"\n\nTeólogos como Agostinho de Hipona desenvolveram esta doutrina, ensinando que o pecado original afeta toda a humanidade e cria uma separação de Deus que só pode ser restaurada através de Cristo."
  },
  {
    question: "me surpreenda",
    answer: "**Você sabia?** 🌟\n\nJesus mencionou o profeta Jonas como um sinal profético de Sua própria morte e ressurreição. Em Mateus 12:39-40, Jesus disse: \"Uma geração má e adúltera pede um sinal miraculoso! Mas nenhum sinal lhe será dado, exceto o sinal do profeta Jonas. Pois assim como Jonas esteve três dias e três noites no ventre de um grande peixe, assim o Filho do homem ficará três dias e três noites no coração da terra.\"\n\nEsta fascinante conexão entre o Antigo e o Novo Testamento mostra como a história de Jonas serviu como uma prefigura profética da morte, sepultamento e ressurreição de Jesus!"
  },
  {
    question: "só versículos sobre amor",
    answer: "**Versículos sobre amor:**\n\n- \"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.\" (João 3:16)\n\n- \"O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.\" (1 Coríntios 13:4-5)\n\n- \"Amados, amemos uns aos outros, pois o amor procede de Deus. Aquele que ama é nascido de Deus e conhece a Deus. Quem não ama não conhece a Deus, porque Deus é amor.\" (1 João 4:7-8)\n\n- \"Acima de tudo, porém, revistam-se do amor, que é o elo perfeito.\" (Colossenses 3:14)"
  }
];

// N8n webhook URL - Updated
const N8N_WEBHOOK_URL = 'https://n8n-n8n.taalus.easypanel.host/webhook/4f63aa06-2cac-4413-9f94-b50cd9b76fba';

// Function to generate a response via n8n webhook
const generateResponse = async (question: string): Promise<string> => {
  try {
    console.log('Sending to webhook:', question);
    
    // Send request to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        timestamp: new Date().toISOString()
      }),
    });
    
    // Log the raw response for debugging
    console.log('Webhook response status:', response.status);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`N8n webhook returned ${response.status}`);
    }
    
    // Get the response text first to log it
    const responseText = await response.text();
    console.log('Webhook raw response:', responseText);
    
    // Try to parse as JSON if possible
    try {
      if (responseText && responseText.trim()) {
        const data = JSON.parse(responseText);
        console.log('Parsed webhook response:', data);
        
        // If we have an answer property, return it
        if (data && data.answer) {
          return data.answer;
        }
        
        // If we received data but no answer property, check for other possible properties
        if (data && typeof data === 'object') {
          if (data.response) return data.response;
          if (data.message) return data.message;
          if (data.result) return data.result;
          if (data.output) return data.output;
          
          // If there's a property that looks like a string, return it
          for (const key in data) {
            if (typeof data[key] === 'string' && data[key].length > 10) {
              return data[key];
            }
          }
          
          // Return the whole JSON as string if nothing else worked
          return JSON.stringify(data);
        }
      }
      
      // If we couldn't parse as JSON or find a suitable property, return the raw text
      if (responseText && responseText.trim()) {
        return responseText;
      }
    } catch (jsonError) {
      console.log('Error parsing JSON response:', jsonError);
      // If we couldn't parse as JSON, return the raw text
      if (responseText && responseText.trim()) {
        return responseText;
      }
    }
    
    // Fall back to sample responses if all else fails
    const lowerQuestion = question.toLowerCase();
    
    // Check for specific questions
    if (lowerQuestion.includes("pecado original")) {
      return AI_RESPONSES[0].answer;
    } else if (lowerQuestion.includes("me surpreenda") || lowerQuestion.includes("surpreender")) {
      return AI_RESPONSES[1].answer;
    } else if (lowerQuestion.includes("só versículos") || lowerQuestion.includes("apenas versículos")) {
      return AI_RESPONSES[2].answer;
    } else {
      // Generic response for other questions
      return "Baseado nas Escrituras, posso dizer que esta é uma pergunta importante para reflexão. A Bíblia nos convida a buscar sabedoria através da oração e do estudo da Palavra.\n\nTalvez possamos explorar isso mais profundamente. Você gostaria de especificar alguma passagem bíblica para discutirmos?";
    }
  } catch (error) {
    console.error('Error sending to n8n webhook:', error);
    throw error;
  }
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Olá! Sou seu assistente bíblico. Posso responder perguntas sobre a Bíblia, teologia e fé cristã. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await generateResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Desculpe, ocorreu um erro ao gerar a resposta.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseMe = async () => {
    setInputValue('Me surpreenda com uma curiosidade bíblica');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "Me surpreenda com uma curiosidade bíblica",
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await generateResponse("me surpreenda");
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating surprise:', error);
      toast.error('Desculpe, ocorreu um erro ao gerar a surpresa bíblica.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-biblia-purple-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-biblia-purple-400 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-biblia-purple-400 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <Card className="border-t rounded-none rounded-b-lg p-2">
        <div className="flex items-end gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-shrink-0 text-biblia-blue-500"
            onClick={handleSurpriseMe}
            disabled={isLoading}
            title="Me surpreenda"
          >
            <Sparkles className="h-4 w-4" />
            <span className="sr-only">Me surpreenda</span>
          </Button>
          
          <Textarea
            placeholder="Faça uma pergunta sobre a Bíblia..."
            className="min-h-11 resize-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          
          <Button
            type="submit" 
            size="icon" 
            className="flex-shrink-0 bg-biblia-purple-500 text-white hover:bg-biblia-purple-600"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensagem</span>
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-2">
          <span>BíbliaIA+ combina versículos bíblicos e comentários teológicos</span>
        </div>
      </Card>
    </div>
  );
};

export default ChatBox;
