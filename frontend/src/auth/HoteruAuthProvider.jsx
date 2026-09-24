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

                /*
                 * Always request a fresh access token.
                 *
                 * Auth0 will use the refresh token when the
                 * previous access token has expired.
                 */
                const token = await getAccessTokenSilently();

                if (cancelled) return;

                const baseURL =
                    import.meta.env.VITE_API_BASE_URL || "";

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

                const response = await res.json();

                if (!res.ok || !response.success) {
                    throw new Error(
                        response.message || "User sync failed."
                    );
                }

                if (cancelled) return;

                /*
                 * Only mark Hoteru authentication as ready
                 * after both token acquisition and DB sync
                 * have succeeded.
                 */
                setAccessToken(token);
                setCurrentUser(response.data);
            } catch (error) {
                if (cancelled) return;

                console.error(
                    "User authentication/sync failed:",
                    error
                );

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