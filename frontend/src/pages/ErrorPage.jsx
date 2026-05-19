import { useRouteError, Link } from 'react-router';

const ErrorPage = () => {
    const error = useRouteError();

    // Log it to console/analytics tool for debugging
    console.error("Caught by React Router:", error);

    return (
        <div className="flex flex-col items-center justify-center  bg-gray-50 p-6 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-2">Oops!</h1>
            <p className="text-xl text-gray-700 mb-4">Sorry, an unexpected error has occurred.</p>

            {/* Box showing the actual error details */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md shadow-sm mb-6 font-mono text-sm text-left text-red-500">
                <p className="font-bold mb-1">
                    {error.status} {error.statusText}
                </p>
                <p>{error.data || error.message || "Unknown Error"}</p>
            </div>

            <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default ErrorPage;