
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Moon, 
  Sun, 
  Menu,
  Search, 
  User,
  LogOut
} from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Até logo!"
      });
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-biblia-purple-500 to-biblia-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">BíbliaIA+</span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-biblia-purple-500">
              Home
            </Link>
            <Link to="/chat" className="text-sm font-medium transition-colors hover:text-biblia-purple-500">
              IA
            </Link>
            <Link to="/bible" className="text-sm font-medium transition-colors hover:text-biblia-purple-500">
              Bíblia
            </Link>
            <Link to="/plans" className="text-sm font-medium transition-colors hover:text-biblia-purple-500">
              Planos
            </Link>
            <Link to="/community" className="text-sm font-medium transition-colors hover:text-biblia-purple-500">
              Comunidade
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-biblia-purple-100 text-biblia-purple-700">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sair</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/auth')}>Entrar</Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background border-t z-40 animate-fadeIn">
          <nav className="flex flex-col p-4">
            <Link 
              to="/" 
              className="flex items-center py-3 px-4 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-medium">Home</span>
            </Link>
            <Link 
              to="/chat" 
              className="flex items-center py-3 px-4 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-medium">IA</span>
            </Link>
            <Link 
              to="/bible" 
              className="flex items-center py-3 px-4 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-medium">Bíblia</span>
            </Link>
            <Link 
              to="/plans" 
              className="flex items-center py-3 px-4 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-medium">Planos</span>
            </Link>
            <Link 
              to="/community" 
              className="flex items-center py-3 px-4 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-medium">Comunidade</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
