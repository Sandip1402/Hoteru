

export const CallAPI = async (endpoint, options = {}, isProtected = false, accessToken = null) => {

  // If backend is on a different domain, set VITE_API_BASE_URL in .env
  const baseURL = import.meta.env.VITE_API_BASE_URL || '';

  console.log("Calling API:", `${baseURL}/api${endpoint}`, "Protected:", isProtected);

  try {

    // Build headers (extracting and merging with any custom headers)
    const headers = {
      // for file uploads, we don't want to set content-type to json
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(isProtected && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    // API call
    let res = await fetch(`${baseURL}/api${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    // check response status
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    // Parse response data - assuming only JSON response
    const data = await res.json();

    // handle error
    if (!data.success) {
      const error = new Error(data.message || "Request failed");
      error.status = res.status;
      throw error;
    }

    return data;

  } catch (err) {
    console.error("API call failed:", err);
    throw err;
  }
}


// // Handle expired token only if route is protected
// if (isProtected && res.status === 401) {
//   const refreshRes = await fetch("/api/refresh", {
//     method: "POST",
//     credentials: "include",
//   });

//   const refreshData = await refreshRes.json();

//   if (refreshData.success) {
//     setAccessToken(refreshData.accessToken);

//     // Retry original request with new token
//     res = await fetch(`/api${endpoint}`, {
//       ...options,
//       headers: {
//         ...headers,
//         Authorization: `Bearer ${refreshData.accessToken}`,
//       },
//       credentials: "include",
//     });
//   } else {
//     throw new Error("Unauthorized: refresh failed");
//   }
// }