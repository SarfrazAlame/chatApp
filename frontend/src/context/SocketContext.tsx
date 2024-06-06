import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import io, { Socket } from "socket.io-client";
import { AuthContext } from "./authContext";

interface IStocketContext {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<IStocketContext | undefined>(undefined);

export const useSocketContext = (): IStocketContext => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocketContext must be used within a socketContextProvider"
    );
  }
  return context;
};

const sockertURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (authUser && !isLoading) {
      const socket = io(sockertURL, {
        query: {
          userId: authUser.id,
        },
      });
      socketRef.current = socket;
      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
        socketRef.current = null;
      };
    } else if (!authUser && !isLoading) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
  }, [authUser, isLoading]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
