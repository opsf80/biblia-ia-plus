
import Layout from '@/components/layout/Layout';
import BibleReader from '@/components/bible/BibleReader';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const BiblePage = () => {
  return (
    <Layout>
      <div className="container py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Bíblia Sagrada</h1>
          <Button variant="outline" asChild>
            <Link to="/bible/search">
              <Search className="h-4 w-4 mr-2" />
              <span>Pesquisar</span>
            </Link>
          </Button>
        </div>
        <BibleReader />
      </div>
    </Layout>
  );
};

export default BiblePage;
