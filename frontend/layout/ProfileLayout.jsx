import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../src/auth/useAuth'

import { FaChevronLeft, FaHamburger } from 'react-icons/fa'
import { ProfileSideBar, LogoutButton } from '../src/components'


const ProfileLayout = () => {

    const [show, setShow] = useState(false);
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    // Close sidebar on route change (for mobile)
    useEffect(() => {
        setShow(false);
    }, [location.pathname])


    return (
        <div className='relative max-md:p-3 md:p-5 lg:px-25'>

            {/* back button */}
            <span onClick={() => navigate(-1)} className='hidden sm:flex items-center w-max 
                                    text-gray-500 cursor-pointer hover:underline'>
                <FaChevronLeft size={10} />
                Back
            </span>

            {/* Menu & Heading */}
            <span className='flex text-xl items-center gap-x-2 md:my-2'>
                {<span className='sm:hidden' onClick={() => setShow(!show)}>
                    <FaHamburger size={15} />
                </span>}
                <p className='sm:font-bold'>Account Settings</p>
            </span>

            {/* sidebar and content screen-wise */}
            {/* fix - height */}
            <div className='sm:flex sm:p-3 lg:p-5 2xl:p-10 sm:gap-x-3 lg:gap-x-5 2xl:gap-x-10 sm:bg-gray-100 rounded-box'>
                {show && <ProfileSideBar setFunc={setShow} style={'sm:hidden absolute z-10 py-2 px-4 shadow-md w-60 *:last:gap-y-4'} />}
                <ProfileSideBar style={'hidden sm:block h-max sm:w-3/10 max-w-80 sm:p-3 lg:p-5 2xl:p-10 *:last:gap-y-5 shadow-md'} />
                <Outlet />
            </div>

            {/* <div className='max-sm:hidden flex max-lg:px-2 lg:px-8'>
                    <Outlet />
                </div> */}

        </div>
    )
}

export default ProfileLayout
