import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const HoteruAuthContext = createContext(null);

export const HoteruAuthProvider = ({ children }) => {
    const {
        user, // Auth0 user
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
    } = useAuth0();

    const [accessToken, setAccessToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(null); // DB user with roles
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            setAccessToken(null);
            setCurrentUser(null);
            setSyncError(null);
            return;
        }

        const syncUser = async () => {
            try {
                setIsSyncing(true);
                setSyncError(null);

                const token = await getAccessTokenSilently();
                const baseURL = import.meta.env.VITE_API_BASE_URL || '';

                // sync user
                const res = await fetch(`${baseURL}/api/users/sync`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    credentials: "include"
                });

                const response = await res.json();

                if (!res.ok || !response.success) {
                    throw new Error(response.message || "Sync failed");
                }

                setAccessToken(token);
                setCurrentUser(response.data);
            } catch (error) {
                console.error("User sync failed:", error);
                setSyncError(error);
            } finally {
                setIsSyncing(false);
            }
        };

        syncUser();
    }, [
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
    ]);

    return (
        <HoteruAuthContext.Provider
            value={{
                user,
                currentUser,
                accessToken,
                isAuthenticated,
                isLoading,
                isSyncing,
                syncError,
                setAccessToken,
                getAccessTokenSilently,
            }}
        >
            {children}
        </HoteruAuthContext.Provider>
    );
};

export const useHoteruAuth = () => {
    const context = useContext(HoteruAuthContext);

    if (!context) {
        throw new Error(
            "useHoteruAuth must be used inside HoteruAuthProvider"
        );
    }

    return context;
};