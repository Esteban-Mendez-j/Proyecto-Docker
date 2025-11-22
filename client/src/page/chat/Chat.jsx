import { useParams } from "react-router-dom";
import ChatPrincipal from "../../components/ChatPrincipal.jsx";
import "../../style/invitado/chat.css";
import Header from "../../layouts/Header.jsx";

export default function ChatPage() {
  const { id } = useParams(); // equivalente a Astro.params

  return (

    <div className="chat-layout">
      <Header />
      <ChatPrincipal chatId={id} />
    </div>
  );
}
