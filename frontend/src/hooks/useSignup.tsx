import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import toast from "react-hot-toast";

type SignUpInputs = {
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
};

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useContext(AuthContext);

  const signup = async (inputes: SignUpInputs) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputes),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setAuthUser(data);
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;
