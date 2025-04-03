import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../services/authService";
 
type UserProps = {
  token: string;
};
 
type LoginParamsProps = {
  email: string;
  password: string;
};
 
export const useAuth = () => {
  const [user, setUser] = useState<UserProps | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
 
  const navigate = useNavigate();
  const isAuthenticated = !!user?.token;
 
  useEffect(() => {
    const verifyAuth = () => {
      const token = localStorage.getItem("authToken");
      if (!token && !window.location.pathname.includes("/sign-")) {
        navigate("/sign-in", { replace: true });
      }
    };
    verifyAuth();
  }, [navigate]);
 
  const login = async ({ email, password }: LoginParamsProps): Promise<boolean> => {
    try {
      const response = await authenticate({ email, password });
 
      const token = response.message;
     
      if (!token) {
        return false;
      }
 
      const userData = { token };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);
 
      if (localStorage.getItem('authToken') !== token) {
        throw new Error('Falha ao armazenar token no localStorage');
      }
 
      setUser(userData);
      navigate('/home', { replace: true });
      return true;
 
    } catch  {
      return false;
    }
  };
 
  const logout = (): void => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/sign-in", { replace: true });
  };
 
  return {
    user,
    isAuthenticated,
    login,
    logout
  };
};