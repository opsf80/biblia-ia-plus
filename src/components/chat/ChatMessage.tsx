
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={cn(
        "flex gap-3",
        message.isUser ? "justify-end" : "justify-start"
      )}
    >
      {!message.isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-biblia-purple-500 text-white">B</AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "rounded-lg p-4 max-w-[80%]",
          message.isUser 
            ? "bg-biblia-purple-500 text-white" 
            : "bg-muted"
        )}
      >
        <div className="prose dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <div className={cn(
          "text-xs mt-1",
          message.isUser ? "text-white/70" : "text-muted-foreground"
        )}>
          {new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          }).format(message.timestamp)}
        </div>
      </div>
      
      {message.isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-biblia-blue-500 text-white">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
