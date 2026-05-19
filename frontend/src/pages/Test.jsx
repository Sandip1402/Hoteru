import { useAuth } from '../Auth/useAuth';
import { CallAPI } from '../util/callAPI'


import { useEffect, useState } from 'react';
import ErrorPage from './ErrorPage';
import RootError from './RootCrash';

export const Test = () => {

  const [data, setData] = useState(null);
  const { accessToken, isLoading } = useAuth();

  const fetchData = async () => {
    try {
      const response = await CallAPI('/test', { method: 'GET' }, true, accessToken);
      // console.log(response);
      setData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // make the protected call when the token is fully loaded
    if (!isLoading && accessToken) {
      fetchData();
    }
  }, [accessToken, isLoading]);

  useEffect(() => {

  }, [data]);


  return (
    <div className='flex flex-col gap-y-4 justify-center items-center'>
      {/* <button className='btn ' onClick={fetchData}>Fetch Data</button>
      <span className='shadow p-4'>{data ? JSON.stringify(data) : 'No data fetched'}</span> */}
      {/* <ErrorPage /> */}
      <RootCrash />
    </div>
  )
}

