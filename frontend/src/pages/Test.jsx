import { useEffect, useState } from 'react';
import { useHoteruAuth } from '../auth/HoteruAuthProvider';
import { callAPI } from '../utils/callAPI'; // Keeping this if you need it later

export const Test = () => {
  const [apiData, setApiData] = useState(null);
  const [apiError, setApiError] = useState(null);

  const { 
    user,
    currentUser,
    accessToken,
    isAuthenticated,
    isLoading,
    isSyncing,
    syncError,
    getAccessTokenSilently 
  } = useHoteruAuth();

  // Helper to safely fetch authenticated API data for testing
  const handleFetchTestData = async () => {
    try {
      setApiError(null);
      // Example call utilizing your context token
      const response = await callAPI('/test', { method: 'GET' }, true, accessToken);
      setApiData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      setApiError(error.message || 'API Call Failed');
    }
  };

  return (
    <div className='flex flex-col gap-y-6 p-6 max-w-4xl mx-auto my-3 font-sans bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold text-main border-b pb-2'>Hoteru Auth Testing Panel</h1>
      
      {/* State Badges Row */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className={`p-3 rounded shadow text-center font-semibold ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          Auth Status: {isAuthenticated ? '🟢 Authenticated' : '🔴 Unauthenticated'}
        </div>
        <div className={`p-3 rounded shadow text-center font-semibold ${isLoading ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
          Loading: {isLoading ? '⏳ True' : '❌ False'}
        </div>
        <div className={`p-3 rounded shadow text-center font-semibold ${isSyncing ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          Syncing User: {isSyncing ? '🔄 True' : '❌ False'}
        </div>
        <div className={`p-3 rounded shadow text-center font-semibold ${syncError ? 'bg-red-200 text-red-900' : 'bg-gray-100 text-gray-800'}`}>
          Sync Error: {syncError ? '⚠️ Error Present' : '✅ None'}
        </div>
      </div>

      {/* Detailed Hook Object Output */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        
        {/* Auth0 Identity Metadata */}
        <div className='bg-white p-4 rounded-lg shadow border'>
          <h2 className='text-lg font-bold text-sub mb-2'>1. Auth0 Profile (`user`)</h2>
          <pre className='bg-gray-900 text-green-400 p-3 rounded overflow-x-auto text-xs max-h-60'>
            {user ? JSON.stringify(user, null, 2) : 'No Auth0 user active'}
          </pre>
        </div>

        {/* Database User Object */}
        <div className='bg-white p-4 rounded-lg shadow border'>
          <h2 className='text-lg font-bold text-sub mb-2'>2. Hoteru DB Profile (`currentUser`)</h2>
          <pre className='bg-gray-900 text-blue-400 p-3 rounded overflow-x-auto text-xs max-h-60'>
            {currentUser ? JSON.stringify(currentUser, null, 2) : 'No matched DB user synced'}
          </pre>
          {currentUser?.roles && (
            <div className='mt-2 p-2 bg-purple-100 text-purple-900 rounded font-mono text-sm'>
              Detected Assigned Role: <strong>{currentUser.roles}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Access Token Display */}
      <div className='bg-white p-4 rounded-lg shadow border w-full'>
        <h2 className='text-lg font-bold text-sub mb-1'>3. JWT Access Token</h2>
        <p className='text-xs text-gray-400 mb-2 truncate font-mono'>Methods: {getAccessTokenSilently ? 'getAccessTokenSilently exists ✅' : '❌'}</p>
        <div className='bg-gray-100 p-3 rounded font-mono text-xs text-gray-700 break-all select-all border max-h-24 overflow-y-auto'>
          {accessToken ? accessToken : 'No access token extracted yet.'}
        </div>
      </div>

      {/* Live API Action Testing Endpoint */}
      <div className='bg-white p-4 rounded-lg shadow border w-full'>
        <h2 className='text-lg font-bold text-sub mb-3'>4. Guarded Endpoint API Test</h2>
        <div className='flex gap-x-4 items-center mb-4'>
          <button 
            disabled={!accessToken}
            className={`px-4 py-2 rounded-full text-white font-semibold shadow ${accessToken ? 'bg-primary hover:bg-primary/80 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`} 
            onClick={handleFetchTestData}
          >
            Trigger authenticated GET request
          </button>
          {!accessToken && <span className='text-xs text-amber-600'>⚠️ Login and wait for an accessToken to enable API testing.</span>}
        </div>

        {apiData && (
          <div className='bg-green-50 border border-green-300 p-4 rounded'>
            <h3 className='font-semibold text-green-900 mb-1'>API Success Payload:</h3>
            <pre className='text-xs font-mono text-green-800 whitespace-pre-wrap'>{JSON.stringify(apiData, null, 2)}</pre>
          </div>
        )}

        {apiError && (
          <div className='bg-red-50 border border-red-300 p-4 rounded text-red-800 text-sm font-mono'>
            <strong>Failed Request Reason:</strong> {apiError}
          </div>
        )}
      </div>

    </div>
  );
};
