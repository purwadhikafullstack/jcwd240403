import { createContext, useContext, useState } from "react";
import useToken from "../hooks/useToken";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { token, saveToken, removeToken } = useToken();
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = (token) => {
    saveToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
