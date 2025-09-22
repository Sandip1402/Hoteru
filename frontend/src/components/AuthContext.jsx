import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await fetch("/api/refresh", { method: "POST", credentials: "include" });
        const data = await res.json();
        if (data.success && data.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch (err) {
        setAccessToken(null);
      }
    };
    refreshToken();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};


export function useAuth(){
  return useContext(AuthContext);
}