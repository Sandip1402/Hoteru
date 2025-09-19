
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
      credentials: "include", // send cookies (refresh token)
    });

    // Handle expired token only if route is protected
    if (isProtected && res.status === 401) {
      const refreshRes = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.success) {
        const refreshData = await refreshRes.json();
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
    if (!data.success) {
      throw new Error(`API error: ${res.status}`);
    } else {
      console.log("request successful");
    }

    return data;
  };

  return apiFetch;
}