import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from './ThemeToggle';
import { Menu, User, LogOut, Book, Users, Star, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleLogout = async () => {
    const {
      error
    } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Erro ao sair',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Logout realizado com sucesso'
      });
      navigate('/');
    }
  };
  const menuItems = [{
    name: 'Bíblia',
    path: '/bible',
    icon: <Book className="h-5 w-5 md:mr-2" />
  }, {
    name: 'Mentor Bíblico IA',
    path: '/chat',
    icon: <MessageSquare className="h-5 w-5 md:mr-2" />
  }, {
    name: 'Planos',
    path: '/plans',
    icon: <Star className="h-5 w-5 md:mr-2" />
  }, {
    name: 'Comunidade',
    path: '/community',
    icon: <Users className="h-5 w-5 md:mr-2" />
  }];
  return <header className="bg-white dark:bg-gray-900 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://cdn.xplor.com.br/biblia.png" alt="BíbliaIA+" className="h-8" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map(item => <NavLink key={item.path} to={item.path} className={({
            isActive
          }) => `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-biblia-blue-50 text-biblia-blue-700 dark:bg-biblia-blue-900/20 dark:text-biblia-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
                <div className="flex items-center">
                  {item.icon}
                  <span className="Mentor B\xEDblico IA">{item.name}</span>
                </div>
              </NavLink>)}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-biblia-purple-100 text-biblia-purple-700 dark:bg-biblia-purple-900 dark:text-biblia-purple-300">
                      {user.email ? user.email[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" sideOffset={5}>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/plans/premium">
                    <Star className="mr-2 h-4 w-4" />
                    <span>Planos Premium</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Button asChild variant="default">
              <Link to="/auth">Entrar</Link>
            </Button>}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Menu móvel */}
      {isMobileMenuOpen && <div className="md:hidden border-t px-4 py-3 shadow-lg">
          <nav className="flex flex-col gap-2">
            {menuItems.map(item => <NavLink key={item.path} to={item.path} className={({
          isActive
        }) => `flex items-center gap-3 px-4 py-3 rounded-md ${isActive ? 'bg-biblia-blue-50 text-biblia-blue-700 dark:bg-biblia-blue-900/20 dark:text-biblia-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`} onClick={() => setIsMobileMenuOpen(false)}>
                {item.icon}
                <span>{item.name}</span>
              </NavLink>)}
          </nav>
        </div>}
    </header>;
};
export default Header;
