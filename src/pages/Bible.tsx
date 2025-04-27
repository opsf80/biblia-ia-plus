
import Layout from '@/components/layout/Layout';
import BibleReader from '@/components/bible/BibleReader';

const BiblePage = () => {
  return (
    <Layout>
      <div className="container py-4">
        <h1 className="text-2xl font-bold mb-4">Bíblia Sagrada</h1>
        <BibleReader />
      </div>
    </Layout>
  );
};

export default BiblePage;
