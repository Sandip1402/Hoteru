import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { useAuth } from '../src/hooks/useAuth'

import { FaChevronLeft, FaHamburger } from 'react-icons/fa'
import { ProfileSideBar } from '../src/components/ProfileSideBar'
import { LoginButton } from '../src/components/Loginbutton';
import { LogoutButton } from '../src/components/LogoutButton';


const ProfileLayout = () => {

    const [show, setShow] = useState(false);
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Close sidebar on route change (for mobile)
    useEffect(() => {
        setShow(false);
    }, [location.pathname])

    if (isLoading) {
        return <div className="loading-text">Loading profile...</div>;
    }

    return (
        // isAuthenticated && user ? (
            <div className='relative max-md:p-3 md:p-5 lg:px-25'>

                {/* back button */}
                <span onClick={() => navigation.back()} className='hidden sm:flex items-center w-max 
                                    text-gray-500 cursor-pointer hover:underline'>
                    <FaChevronLeft size={10} />
                    Back
                </span>

                {/* Menu & Heading */}
                <span className='flex text-xl items-center gap-x-2 md:my-5'>
                    {<span className='sm:hidden' onClick={() => setShow(!show)}>
                        <FaHamburger size={15} />
                    </span>}
                    <p className='sm:font-bold'>Account Settings</p>
                </span>

                {/* sidebar and content screen-wise */}
                {/* fix - height */}
                {show && <ProfileSideBar setFunc={setShow} style={'sm:hidden absolute z-10 py-2 px-4 border-y-2 w-2/3 *:last:gap-y-4'} />}
                <div className='sm:flex max-lg:px-2 lg:px-8'>
                    <ProfileSideBar style={'hidden sm:block sm:w-3/10 p-4 *:last:gap-y-5 h-max'} />
                    <Outlet />
                </div>

                {/* <div className='max-sm:hidden flex max-lg:px-2 lg:px-8'>
                    <Outlet />
                </div> */}

            </div>
        // ) 
        // : (
        //     <div className="flex flex-col gap-y-2 items-center justify-center h-dvh ">
        //         <p>Please log in to view your profile</p>
        //         <LoginButton />
        //     </div>
        // )
    )
}

export default ProfileLayout
