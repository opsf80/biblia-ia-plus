
import Layout from '@/components/layout/Layout';

const TermsPage = () => {
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
        
        <div className="prose prose-blue max-w-none dark:prose-invert">
          <p className="lead">
            Bem-vindo à BíbliaIA+. Ao acessar e usar nossa plataforma, você concorda com os termos e condições estabelecidos neste documento.
          </p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou utilizar a plataforma BíbliaIA+, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
            Se você não concordar com alguma parte destes termos, não poderá acessar ou utilizar nossos serviços.
          </p>
          
          <h2>2. Descrição do Serviço</h2>
          <p>
            A BíbliaIA+ é uma plataforma de estudo bíblico que combina textos sagrados com tecnologia de inteligência artificial 
            para fornecer uma experiência de aprendizado personalizada e interativa.
          </p>
          
          <h2>3. Contas de Usuário</h2>
          <p>
            Para acessar certos recursos da plataforma, você precisará criar uma conta. Ao criar uma conta, você concorda em:
          </p>
          <ul>
            <li>Fornecer informações precisas e completas</li>
            <li>Manter a confidencialidade de sua senha</li>
            <li>Ser responsável por todas as atividades que ocorrem em sua conta</li>
            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
          </ul>
          
          <h2>4. Planos e Assinaturas</h2>
          <p>
            Oferecemos diferentes planos de assinatura com funcionalidades variadas:
          </p>
          <ul>
            <li>Planos gratuitos com funcionalidades básicas</li>
            <li>Planos premium com recursos avançados mediante pagamento de assinatura</li>
          </ul>
          <p>
            As assinaturas são renovadas automaticamente até que sejam canceladas pelo usuário. 
            O cancelamento pode ser realizado a qualquer momento através da conta do usuário.
          </p>
          
          <h2>5. Conteúdo da Plataforma</h2>
          <p>
            Todos os textos bíblicos, comentários teológicos e outros materiais disponíveis na plataforma são protegidos 
            por direitos autorais e outras leis de propriedade intelectual.
          </p>
          
          <h2>6. Conteúdo do Usuário</h2>
          <p>
            Ao submeter qualquer conteúdo à plataforma (como comentários, perguntas ou reflexões):
          </p>
          <ul>
            <li>Você mantém os direitos sobre seu conteúdo</li>
            <li>Você concede à BíbliaIA+ uma licença mundial, não exclusiva e isenta de royalties para usar, reproduzir e distribuir seu conteúdo</li>
            <li>Você é responsável pelo conteúdo que envia e garante que possui os direitos necessários para compartilhá-lo</li>
          </ul>
          
          <h2>7. Limitações de Uso</h2>
          <p>
            Você concorda em não utilizar a BíbliaIA+ para:
          </p>
          <ul>
            <li>Atividades ilegais ou fraudulentas</li>
            <li>Assédio, abuso ou difamação de outros usuários</li>
            <li>Publicação de conteúdo ofensivo ou inadequado</li>
            <li>Interferir no funcionamento adequado da plataforma</li>
          </ul>
          
          <h2>8. Alterações nos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
            Alterações significativas serão notificadas aos usuários através da plataforma ou por e-mail.
          </p>
          
          <h2>9. Cancelamento de Conta</h2>
          <p>
            Reservamo-nos o direito de suspender ou encerrar sua conta se violar estes termos ou por qualquer outro motivo razoável.
          </p>
          
          <h2>10. Lei Aplicável</h2>
          <p>
            Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil.
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            Data da última atualização: 28 de abril de 2023
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
