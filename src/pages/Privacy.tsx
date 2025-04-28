
import Layout from '@/components/layout/Layout';

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
        
        <div className="prose prose-blue max-w-none dark:prose-invert">
          <p className="lead">
            Na BíbliaIA+, levamos sua privacidade a sério. Esta política explica como coletamos, usamos e protegemos suas informações pessoais.
          </p>
          
          <h2>1. Informações que Coletamos</h2>
          <p>
            Podemos coletar os seguintes tipos de informações:
          </p>
          <ul>
            <li><strong>Informações de cadastro</strong>: nome, e-mail, senha e preferências de usuário.</li>
            <li><strong>Dados de uso</strong>: como você interage com nossa plataforma, incluindo versículos acessados, pesquisas realizadas e funcionalidades utilizadas.</li>
            <li><strong>Informações de pagamento</strong>: para processamento de assinaturas premium (processadas de forma segura por nossos parceiros de pagamento).</li>
            <li><strong>Conteúdo gerado pelo usuário</strong>: comentários, perguntas e outras contribuições que você faz na plataforma.</li>
          </ul>
          
          <h2>2. Como Usamos suas Informações</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul>
            <li>Fornecer, personalizar e melhorar nossos serviços</li>
            <li>Processar suas transações e gerenciar sua conta</li>
            <li>Enviar comunicações importantes sobre sua conta ou mudanças em nossos serviços</li>
            <li>Enviar materiais de marketing (com seu consentimento)</li>
            <li>Analisar tendências de uso e melhorar nossa plataforma</li>
            <li>Proteger a segurança e integridade da plataforma e de seus usuários</li>
          </ul>
          
          <h2>3. Compartilhamento de Informações</h2>
          <p>
            Não vendemos suas informações pessoais. Compartilhamos suas informações apenas nas seguintes circunstâncias:
          </p>
          <ul>
            <li>Com fornecedores de serviços que nos ajudam a operar nossa plataforma (como provedores de pagamento)</li>
            <li>Para cumprir obrigações legais</li>
            <li>Com seu consentimento explícito</li>
            <li>Em caso de reorganização, fusão ou venda da empresa</li>
          </ul>
          
          <h2>4. Proteção de Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, 
            alteração, divulgação ou destruição. Isso inclui criptografia, firewalls, controles de acesso e revisões regulares de segurança.
          </p>
          
          <h2>5. Seus Direitos</h2>
          <p>
            Você tem direito a:
          </p>
          <ul>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir informações imprecisas</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Restringir ou opor-se ao processamento de seus dados</li>
            <li>Solicitar a portabilidade de seus dados</li>
            <li>Retirar seu consentimento a qualquer momento</li>
          </ul>
          
          <h2>6. Cookies e Tecnologias Semelhantes</h2>
          <p>
            Usamos cookies e tecnologias similares para melhorar sua experiência, lembrar suas preferências e entender como você usa nossa plataforma. 
            Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
          </p>
          
          <h2>7. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pessoais pelo tempo necessário para fornecer nossos serviços e cumprir nossas obrigações legais. 
            Após esse período, seus dados serão excluídos ou anonimizados.
          </p>
          
          <h2>8. Privacidade de Crianças</h2>
          <p>
            Nossa plataforma não é direcionada a menores de 13 anos, e não coletamos intencionalmente informações de crianças menores de 13 anos.
          </p>
          
          <h2>9. Transferências Internacionais</h2>
          <p>
            Suas informações podem ser transferidas e processadas em servidores localizados fora de seu país de residência, 
            onde as leis de proteção de dados podem ser diferentes.
          </p>
          
          <h2>10. Alterações a esta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas por e-mail ou através de um aviso em nossa plataforma.
          </p>
          
          <h2>11. Contato</h2>
          <p>
            Se você tiver dúvidas ou preocupações sobre esta política de privacidade ou sobre como tratamos seus dados, 
            entre em contato conosco pelo e-mail: privacidade@bibliaai.com.br
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            Data da última atualização: 28 de abril de 2023
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
