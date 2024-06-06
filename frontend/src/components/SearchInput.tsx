import { Search } from "lucide-react";
import { useState } from "react";
import useConversations, { ConversationType } from "../zustand/useConversation";
import useGetConversation from "../hooks/useGetConversation";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversations();
  const { conversations } = useGetConversation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c: ConversationType) => {
      c.fullname.toLowerCase().includes(search.toLowerCase());
    });

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error("No such user found");
  };
  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search…"
        className="input-sm md:input input-bordered rounded-full sm:rounded-full w-full py-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="btn md:btn-md btn-sm btn-circle bg-sky-500 text-white rounded-full "
      >
        <Search className="w-4 h-4 md:w-8 md:h-8 outline-none " />
      </button>
    </form>
  );
};

export default SearchInput;
