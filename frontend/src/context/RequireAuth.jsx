import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

export const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login first</div>

  return children;
};
