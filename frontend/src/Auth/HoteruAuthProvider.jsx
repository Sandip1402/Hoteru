import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { callAPI } from "../utils/callAPI";

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

                const response = await callAPI(
                    "/users/sync",
                    {
                        method: "POST",
                    },
                    true,
                    token
                );

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