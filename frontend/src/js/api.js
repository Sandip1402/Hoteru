
// const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options) => {
    const res = await fetch(`/api${endpoint}`, {
                    headers: {"Content-Type": "application/json"},
                    ...options,
                });
    const data = await res.json();
    if (!data.success) {
        throw new Error(`API error: ${res.status}`);
    }else{
        console.log("request successful");
    }
    return data;
}
