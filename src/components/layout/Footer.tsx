import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Sobre</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">Quem Somos</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Recursos</h3>
            <ul className="space-y-2">
              <li><Link to="/bible" className="hover:text-white transition-colors">Bíblia Online</Link></li>
              <li><Link to="/plans" className="hover:text-white transition-colors">Planos de Leitura</Link></li>
              <li><Link to="/bible/search" className="hover:text-white transition-colors">Pesquisa Bíblica</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Comunidade</h3>
            <ul className="space-y-2">
              <li><Link to="/community" className="hover:text-white transition-colors">Fórum</Link></li>
              <li><Link to="/chat" className="hover:text-white transition-colors">Chat em Tempo Real</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contato</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-white transition-colors">Fale Conosco</Link></li>
              <li>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                  <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                  <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                  <a href="#" className="hover:text-white transition-colors"><Youtube size={20} /></a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
