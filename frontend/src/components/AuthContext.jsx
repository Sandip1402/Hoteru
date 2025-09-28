import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch("/api/refresh", { method: "POST", credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setAccessToken(data.accessToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  if (loading) {
    return (
      <div>Loading ... </div>
    )
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};


export function useAuth() {
  return useContext(AuthContext);
}