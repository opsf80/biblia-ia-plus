
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-biblia-blue-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/">
              <img 
                src="https://meliexplore.com.br/cdn/xplor_blue-white.png"
                alt="BíbliaIA+"
                className="h-12 mb-4"
              />
            </Link>
            <p className="text-sm text-gray-300">
              Seu mentor bíblico pessoal, combinando teologia confiável com inteligência artificial avançada.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/bible" className="hover:text-biblia-purple-300 transition-colors">Bíblia</Link></li>
              <li><Link to="/chat" className="hover:text-biblia-purple-300 transition-colors">Perguntar à IA</Link></li>
              <li><Link to="/plans" className="hover:text-biblia-purple-300 transition-colors">Planos de Estudo</Link></li>
              <li><Link to="/community" className="hover:text-biblia-purple-300 transition-colors">Comunidade</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-biblia-purple-300 transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contact" className="hover:text-biblia-purple-300 transition-colors">Contato</Link></li>
              <li><Link to="/terms" className="hover:text-biblia-purple-300 transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacy" className="hover:text-biblia-purple-300 transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Assine</h3>
            <p className="text-sm text-gray-300 mb-4">
              Tenha acesso a recursos exclusivos e aprofunde seu conhecimento bíblico.
            </p>
            <Link 
              to="/plans/premium" 
              className="bg-biblia-purple-500 hover:bg-biblia-purple-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Ver Planos
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} BíbliaIA+ - Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
