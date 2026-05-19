import { useNavigate } from 'react-router';

import { useAuth } from '../Auth/useAuth.js';
import { LoginButton } from './Loginbutton.jsx';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    if (isLoading) return <div>Loading...</div>;

    return isAuthenticated ? (children) :
        (
            <div className="flex flex-col gap-y-5 justify-center items-center py-20">
                <span className="flex flex-col gap-y-2 justify-center items-center">
                    <p>Please log in to view requested page</p>
                    <LoginButton />
                </span>
                <span className='text-gray-500'>---------- OR ------------</span>
                {/* Go Back */}
                <span>
                    <button className="bg-primary hover:bg-primary/80 rounded-full py-1 px-3 w-full text-white font-semibold cursor-pointer"
                        onClick={() => navigate(-1)}>
                        Previous Page
                    </button>
                </span>
            </div>
        );
}
