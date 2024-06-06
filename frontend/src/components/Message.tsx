import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import useConversations, { MessageType } from "../zustand/useConversation";
import { extracTime } from "../utils/extracTime";

const message = ({ message }: { message: MessageType }) => {
  const { authUser } = useContext(AuthContext);
  const { selectedConversation } = useConversations();

  const formMe = message?.senderId === authUser?.id;
  const img = formMe ? authUser?.profilePic : selectedConversation?.profilePic;
  const chatClass = formMe ? "chat-end" : "chat-start";

  const bubbleBg = formMe ? "bg-blue-500" : "";
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClass}`}>
      <div className="hidden md:block chat-image avatar">
        <div className="w-6 md:w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={img} />
        </div>
      </div>
      <p
        className={`chat-bubble text-white ${bubbleBg} ${shakeClass} text-sm md:text-md`}
      >
        {message.body}
      </p>
      <span className="chat-footer opacity-50 text-xs flex gap-1 items-center text-white">
        {extracTime(message.createAt)}
      </span>
    </div>
  );
};

export default message;
