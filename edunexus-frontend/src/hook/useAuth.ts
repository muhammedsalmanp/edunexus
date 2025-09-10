// hooks/useAuth.ts
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const useAuth = () => {
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log(user?.role);
  
  return {
    isLoggedIn: isAuthenticated,
    role: user?.role,
    user,
    token,
  };
};

export default useAuth;
