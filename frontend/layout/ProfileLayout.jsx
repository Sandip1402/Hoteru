import { useEffect, useState } from 'react'
import { FaChevronLeft, FaHamburger } from 'react-icons/fa'
import { NavLink, Outlet } from 'react-router'
import { MdOutlineLogout } from 'react-icons/md'


const SideBar = ({ setfunc, style }) => {

    const setShow = setfunc || (() => { }) // default to no-op if not provided
    const sections = {
        personal_details: {
            path: "/profile/personal_info",
            icon: "/Icons/user-profile.svg",
            label: "Personal Details"
        },
        payment_info: {
            path: "/profile/payment_info",
            icon: "/Icons/credit-card.svg",
            label: "Payment Info"
        },
        security: {
            path: "/profile/security",
            icon: "/Icons/lock-alt.svg",
            label: "Security"
        },
        email_notify: {
            path: "/profile/notification",
            icon: "/Icons/Notification.svg",
            label: "Notification"
        }
    }

    return (
        <div className={`bg-white *:not-first:text-gray-600 border-r-2 border-gray-100 ${style}`}>
            {/* fix - on click outside should close */}
            <span className='flex justify-between items-center text-lg border-b-2 border-gray-300 mb-4 sm:hidden'>
                <p>Settings</p>
                <span className='text-gray-500 font-bold' onClick={() => (setShow(false))}>
                    x
                </span>
            </span>

            {/* Sections */}
            <ul className='flex flex-col **:flex **:items-center **:gap-x-3'>
                {Object.entries(sections).map(([key, section]) => (
                    <li key={key}>
                        <NavLink to={section.path}>
                            {({ isActive }) => (
                                <>
                                    <span className={`rounded-full size-9 flex justify-center items-center ${isActive ? 'bg-primary/10' : 'bg-neutral-100'}`}>
                                        <span className="size-5 bg-current"
                                            style={{
                                                maskImage: `url(${section.icon})`,
                                                maskRepeat: 'no-repeat',
                                                maskSize: 'contain',
                                                WebkitMaskImage: `url(${section.icon})`, // For Safari support
                                            }}
                                        />
                                    </span>
                                    <p>{section.label}</p>
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
                <li>
                    <NavLink to="/profile/logout" className='text-red-500'>
                        <span className='size-9 flex justify-center items-center'>
                            <MdOutlineLogout size={20} />
                        </span>
                        <p>Logout</p>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

const ProfileLayout = () => {

    const [show, setShow] = useState(false);

    return (
        <div className='relative max-md:p-3 md:p-5 lg:px-25'>

            {/* back button */}
            <span onClick={() => navigation.back()} className='hidden sm:flex items-center w-max text-gray-500'>
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
            <div className='relative sm:hidden'>
                {show && <SideBar setShow={setShow} style={'sticky z-10 py-2 px-4 border-y-2 w-2/3 *:last:gap-y-4'} />}
                <Outlet />
            </div>

            <div className='max-sm:hidden flex max-lg:px-2 lg:px-8'>
                <SideBar style={'sm:w-3/10 p-4 *:last:gap-y-5 h-max'} />
                <Outlet />
            </div>

        </div>
    )
}

export default ProfileLayout
