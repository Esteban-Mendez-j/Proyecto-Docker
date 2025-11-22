import { useParams } from "react-router-dom";
import ChatPrincipal from "../../components/ChatPrincipal";
import "../../style/invitado/chat.css";
import Header from "../../layouts/Header";

export default function ChatPage() {
  const { id } = useParams(); // equivalente a Astro.params

  return (

    <div className="chat-layout">
      <Header />
      <ChatPrincipal chatId={id} />
    </div>
  );
}
