
import Layout from '@/components/layout/Layout';
import ChatBox from '@/components/chat/ChatBox';

const ChatPage = () => {
  return (
    <Layout>
      <div className="container py-4 h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold mb-4">Mentor Bíblico IA</h1>
        <div className="border rounded-lg h-[calc(100%-4rem)]">
          <ChatBox />
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
