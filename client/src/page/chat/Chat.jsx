import { useParams } from "react-router-dom";
import ChatPrincipal from "../../components/ChatPrincipal";
import Layout from "../../layouts/layout";
import "../../style/invitado/chat.css";

export default function ChatPage() {
  const { id } = useParams(); // equivalente a Astro.params

  return (

    <div className="chat-layout">
      <Layout />

      <main>
        <ChatPrincipal chatId={id} />
      </main>

    </div>
  );
}
