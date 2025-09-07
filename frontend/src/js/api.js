
// const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options) => {
    const res = await fetch(`/api${endpoint}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    ...options,
                });
    const json = await res.json();
    if (!json.success) {
        throw new Error(`API error: ${res.status}`);
    }
    return json;
}
