import useGetConversation from "../hooks/useGetConversation";
import { getRandomEmoji } from "../utils/emolis";
import Conversation from "./Conversation";

const Conversations = () => {
  const { conversations, loading } = useGetConversation();
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation: any) => (
        <Conversation key={conversation.id} conversation={conversation} emoji={getRandomEmoji()}/>
      ))}
      {loading ? <span className="loading loading-spinner mx-auto text-white" /> : null}
    </div>
  );
};
export default Conversations;
