import { useHoteruAuth } from "../auth/HoteruAuthProvider";

export const useAPI = () => {
  const { accessToken, setAccessToken, getAccessTokenSilently } = useHoteruAuth();

  const callAPI = async (endpoint, options = {}, isProtected = false) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || '';
    console.log("Calling API:", `${baseURL}/api${endpoint}`, "Protected:", isProtected);

    // get the current token from Context
    let currentToken = accessToken;

    // if context doesn't have it yet get from Auth0 for protected route
    if (isProtected && !currentToken) {
      try {
        currentToken = await getAccessTokenSilently();
        setAccessToken(currentToken);
      } catch (err) {
        console.warn("Could not retrieve initial token silently", err);
      }
    }

    const buildHeaders = (token) => ({
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(isProtected && token ? { Authorization: `Bearer ${token}` } : {}),
    });

    try {
      let res = await fetch(`${baseURL}/api${endpoint}`, {
        ...options,
        headers: buildHeaders(currentToken),
        credentials: "include",
      });

      // Handle 401 Unauthorized safely
      if (isProtected && res.status === 401) {
        console.log("Token might be expired. Attempting silent token rotation via Auth0...");
        
        try {
          // ignore cache and force-verify/refresh the token natively
          const newAccessToken = await getAccessTokenSilently({ ignoreCache: true });
          
          setAccessToken(newAccessToken);

          // Retry
          res = await fetch(`${baseURL}/api${endpoint}`, {
            ...options,
            headers: buildHeaders(newAccessToken),
            credentials: "include",
          });
          
        } catch (refreshError) {
          // Auth0 fails to get a new token silently, the session is officially dead.
          console.error("Auth0 rotation failed. User is truly unauthorized.", refreshError);
          setAccessToken(null); // Log them out of your application state
          throw new Error("Session expired. Please log in again.");
        }
      }

      // Process response payload
      const data = await res.json();

      if (!res.ok || !data.success) {
        const error = new Error(data.message || `Request failed with status ${res.status}`);
        error.status = res.status;
        error.errors = data.errors;
        throw error;
      }

      return data;

    } catch (err) {
      console.error("API call execution error:", err);
      throw err;
    }
  };

  return callAPI;
};
