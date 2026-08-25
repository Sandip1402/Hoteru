import { useNavigate } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { LoginButton } from "./LoginButton.jsx";
import { Loading } from "./Loading.jsx";

export const ProtectedRoute = ({ children }) => {
    const {
        isAuthenticated,
        isLoading,
        isSyncing,
        syncError,
    } = useHoteruAuth();

    const navigate = useNavigate();

    // Auth0 is still determining authentication state
    if (isLoading) {
        return <Loading />;
    }

    // Authenticated, but Hoteru user is still being synced
    if (isAuthenticated && isSyncing) {
        return <Loading />;
    }

    // User sync failed
    if (isAuthenticated && syncError) {
        return (
            <div className="flex flex-col gap-y-5 justify-center items-center py-20">
                <p>Unable to load your account. Please try again.</p>

                <button
                    className="bg-primary hover:bg-primary/80 rounded-full py-1 px-3 text-white font-semibold cursor-pointer"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col gap-y-5 justify-center items-center py-20">
                <span className="flex flex-col gap-y-2 justify-center items-center">
                    <p>Please log in to view requested page</p>
                    <LoginButton />
                </span>

                <span className="text-gray-500">
                    ---------- OR ------------
                </span>

                <span>
                    <button
                        className="bg-primary hover:bg-primary/80 rounded-full py-1 px-3 w-full text-white font-semibold cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        Previous Page
                    </button>
                </span>
            </div>
        );
    }

    // Authenticated and Hoteru user successfully synced
    return children;
};