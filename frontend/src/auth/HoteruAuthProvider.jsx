import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth0 } from "@auth0/auth0-react";

const HoteruAuthContext = createContext(null);

export const HoteruAuthProvider = ({ children }) => {
    const {
        user,
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
    } = useAuth0();

    const [accessToken, setAccessToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!isAuthenticated) {
            setAccessToken(null);
            setCurrentUser(null);
            setSyncError(null);
            return;
        }

        let cancelled = false;

        const syncUser = async () => {
            try {
                setIsSyncing(true);
                setSyncError(null);

                // console.log("1. Starting sync");

                const token = await getAccessTokenSilently();

                // console.log("2. Got access token");

                if (cancelled) return;

                const baseURL =
                    import.meta.env.VITE_API_BASE_URL || "";

                // console.log("3. Calling /users/sync");

                const res = await fetch(
                    `${baseURL}/api/users/sync`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        credentials: "include",
                    }
                );

                // console.log("4. Sync response received", res.status);

                const response = await res.json();

                if (!res.ok || !response.success) {
                    throw new Error(
                        response.message || "User sync failed."
                    );
                }

                // console.log("5. Sync successful");

                if (cancelled) return;

                setAccessToken(token);
                setCurrentUser(response.data);

            } catch (error) {
                console.error("User authentication/sync failed:", error);

                if (cancelled) return;

                setAccessToken(null);
                setCurrentUser(null);
                setSyncError(error);

            } finally {
                if (!cancelled) {
                    setIsSyncing(false);
                }
            }
        };

        syncUser();

        return () => {
            cancelled = true;
        };
    }, [
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
    ]);

    /*
     * Auth0 says the user is authenticated AND
     * Hoteru successfully obtained a token and synced
     * the database user.
     */
    const isAuthReady =
        !isLoading &&
        isAuthenticated &&
        !isSyncing &&
        !!accessToken &&
        !!currentUser;

    return (
        <HoteruAuthContext.Provider
            value={{
                user,
                currentUser,

                accessToken,

                // Auth0 authentication state
                isAuthenticated,

                // Hoteru application authentication state
                isAuthReady,

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