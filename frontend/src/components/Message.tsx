import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import useConversations, { MessageType } from "../zustand/useConversation";
import { extractTime } from "../utils/extracTime";

const message = ({ message }: { message: MessageType }) => {
  const { authUser } = useContext(AuthContext);
  const { selectedConversation } = useConversations();

  const formMe = message?.senderId === authUser?.id;
  const img = formMe ? authUser?.profilePic : selectedConversation?.profilePic;

  const bubbleBg = formMe
    ? "bg-blue-500 text-end w-fit px-3 rounded-full"
    : "bg-gray-500 text-start w-fit rounded-full px-3";
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat `}>
      <div
        className={
          formMe
            ? "flex my-2 items-center gap-1 w-full justify-end"
            : "flex gap-1"
        }
      >
        <div className="hidden md:block chat-image avatar">
          <div className="w-6 md:w-10 rounded-full">
            <img alt="Tailwind CSS chat bubble component " src={img} />
          </div>
        </div>
        <div>
          <p
            className={`chat-bubble text-white ${bubbleBg} ${shakeClass} text-sm md:text-md `}
          >
            {message.body}
          </p>
          <span className="chat-footer opacity-50 text-xs flex gap-1 items-center text-white ">
            {extractTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default message;
