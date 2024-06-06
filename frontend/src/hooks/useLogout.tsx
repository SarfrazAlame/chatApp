import   { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import toast from "react-hot-toast";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useContext(AuthContext);

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setAuthUser(null);
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };
  return { loading, logout };
};

export default useLogout;
