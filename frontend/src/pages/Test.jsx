import { useAuth } from '../Auth/useAuth';
import { callAPI } from '../utils/callAPI'
import { useHoteruAuth } from '../Auth/HoteruAuthProvider';


import { useEffect, useState } from 'react';
import { ErrorPage } from './ErrorPage';
import { RootCrash } from './RootCrash';
import { Loading } from '../components';

export const Test = () => {

  const [data, setData] = useState(null);
  const { currentUser } = useHoteruAuth();

  // const { accessToken, isLoading } = useAuth();

  // const fetchData = async () => {
  //   try {
  //     const response = await CallAPI('/test', { method: 'GET' }, true, accessToken);
  //     // console.log(response);
  //     setData(response);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  useEffect(() => {
    // // make the protected call when the token is fully loaded
    // if (!isLoading && accessToken) {
    //   fetchData();
    // }

  }, [ data]);


  return (
    <div className='flex flex-col gap-y-4 justify-center items-center h-screen'>
      {/* <button className='btn ' onClick={fetchData}>Fetch Data</button>
      <span className='shadow p-4'>{data ? JSON.stringify(data) : 'No data fetched'}</span> */}
      {/* <ErrorPage /> */}
      {/* <RootCrash /> */}
      {/* <Loading /> */}
      {/* <span className='text-main'>Main Text - for logos, headings</span>
      <span className='text-sub'>Sub text - for subheadings</span> */}
      <span className='text-main'>{JSON.stringify(data)}</span>
    </div>
  )
}