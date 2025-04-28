
import Layout from '@/components/layout/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Sobre Nós</h1>
        
        <div className="prose prose-blue max-w-none dark:prose-invert">
          <p className="lead">
            A BíbliaIA+ é uma plataforma revolucionária que combina o estudo bíblico tradicional com a tecnologia de inteligência artificial, tornando o conhecimento teológico mais acessível e personalizado.
          </p>
          
          <h2>Nossa Missão</h2>
          <p>
            Democratizar o acesso ao conhecimento bíblico profundo, permitindo que pessoas de todas as idades e níveis de conhecimento possam entender melhor a Palavra de Deus através de ferramentas modernas e intuitivas.
          </p>
          
          <h2>Nossa Visão</h2>
          <p>
            Ser a principal plataforma de estudo bíblico e crescimento espiritual do mundo, ajudando milhões de pessoas a aprofundar sua compreensão das Escrituras e aplicá-las em suas vidas.
          </p>
          
          <h2>Nossos Valores</h2>
          <ul>
            <li><strong>Fidelidade à Palavra</strong>: Nosso compromisso é apresentar o texto bíblico de forma precisa e confiável.</li>
            <li><strong>Inclusividade</strong>: Acolhemos pessoas de diferentes denominações cristãs, respeitando suas tradições.</li>
            <li><strong>Inovação</strong>: Utilizamos tecnologias avançadas para tornar o estudo bíblico mais envolvente e eficaz.</li>
            <li><strong>Comunidade</strong>: Valorizamos o aprendizado compartilhado e o crescimento em comunidade.</li>
            <li><strong>Excelência</strong>: Buscamos constantemente aprimorar nossas ferramentas e conteúdos.</li>
          </ul>
          
          <h2>Nossa História</h2>
          <p>
            A BíbliaIA+ surgiu da visão de um grupo de teólogos, desenvolvedores e educadores apaixonados por tornar o estudo bíblico mais acessível na era digital. 
            Lançada em 2023, nossa plataforma tem crescido rapidamente, unindo o rigor teológico tradicional com a tecnologia mais avançada disponível.
          </p>
          
          <h2>Nossa Equipe</h2>
          <p>
            Nossa equipe diversificada inclui teólogos, linguistas, especialistas em IA, desenvolvedores de software e educadores, 
            todos trabalhando juntos para criar a melhor experiência possível de estudo bíblico.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
