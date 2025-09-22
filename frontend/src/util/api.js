
// const API_BASE = import.meta.env.VITE_API_BASE_URL;
import { useAuth } from "../components/AuthContext";

export const useApiFetch = () => {
  const { accessToken, setAccessToken } = useAuth();

  const apiFetch = async (endpoint, options = {}, isProtected = false) => {
    // Build headers
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(isProtected && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    let res = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    // Handle expired token only if route is protected
    if (isProtected && res.status === 401) {
      const refreshRes = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include",
      });

      const refreshData = await refreshRes.json();

      if (refreshData.success) {
        setAccessToken(refreshData.accessToken);

        // Retry original request with new token
        res = await fetch(`/api${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${refreshData.accessToken}`,
          },
          credentials: "include",
        });
      } else {
        throw new Error("Unauthorized: refresh failed");
      }
    }

    const data = await res.json();

    // handle error
    if (!res.ok || data.success === false) {
      const error = new Error(data.message || "Request failed");
      error.status = res.status;
      throw error;
    }
    
    return data;
  };

  return apiFetch;
}