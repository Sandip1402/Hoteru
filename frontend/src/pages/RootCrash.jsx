import { useRouteError } from 'react-router';

const RootError = () => {
  const error = useRouteError();
  console.error("Critical Application Crash:", error);

  const handleReset = () => {
    // clear the state and back to a fresh home page
    window.location.href = '/'; 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center text-gray-800 font-sans">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        
        {/* Warning Icon */}
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went seriously wrong</h1>
        <p className="text-gray-600 mb-6">
          The application encountered a critical error and couldn't load the structural framework.
        </p>

        {/* Primary Call to Action */}
        <button
          onClick={handleReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md mb-6 cursor-pointer"
        >
          Refresh Application
        </button>

        {/* Collapsible Technical Details for Devs */}
        <details className="text-left bg-gray-50 rounded-lg p-3 border border-gray-200 cursor-pointer group">
          <summary className="text-xs font-semibold text-gray-500 group-open:mb-2 select-none">
            Technical Error Details
          </summary>
          <pre className="text-xs font-mono text-red-600 overflow-x-auto max-h-40 bg-white p-2 rounded border border-gray-100">
            {error?.stack || error?.message || JSON.stringify(error)}
          </pre>
        </details>

      </div>
    </div>
  );
};

export default RootError;