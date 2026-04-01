import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('rl_admin_token'));

  function login(newToken) {
    localStorage.setItem('rl_admin_token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('rl_admin_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
