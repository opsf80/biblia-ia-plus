
import Layout from '@/components/layout/Layout';
import AuthForm from '@/components/auth/AuthForm';

const AuthPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <AuthForm />
      </div>
    </Layout>
  );
};

export default AuthPage;
