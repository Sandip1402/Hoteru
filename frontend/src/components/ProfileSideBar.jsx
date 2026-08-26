import { MdOutlineLogout } from 'react-icons/md'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/useAuth'

export const ProfileSideBar = ({ setFunc, style }) => {

    const setShow = setFunc || (() => { }) // default to no-op if not provided
    const { logout } = useAuth();

    const sections = {
        personal_info: {
            path: "/user/personal_info",
            icon: "/Icons/user-profile.svg",
            label: "Personal Details"
        },
        security: {
            path: "/user/security",
            icon: "/Icons/lock-alt.svg",
            label: "Security"
        },
        bookings: {
            path: "/user/bookings",
            icon: "/Icons/booking.svg",
            label: "Booking History"
        },
        wishlist: {
            path: "/user/wishlist",
            icon: "/Icons/wishlist.svg",
            label: "Wishlist"
        },
        hostings: {
            path: "/user/hostings",
            icon: "/Icons/hosting.svg",
            label: "Hostings"
        }
    }

    
    return (
        <div className={`bg-white *:not-first:text-gray-600 rounded-box ${style}`}>
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
                        <NavLink to={section.path} end={section.label === "personal_info"}>
                            {({ isActive }) => (
                                <>
                                    <span className={`rounded-full size-9 flex justify-center items-center ${isActive ? 'bg-primary/10' : 'bg-neutral-100'}`}>
                                        {/* Icon with mask */}
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
                <li onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                    <Link to="/user/logout" className='text-red-500'>
                        <span className='size-9 flex justify-center items-center rounded-full bg-red-100'>
                            <MdOutlineLogout size={20} />
                        </span>
                        <p>Logout</p>
                    </Link>
                </li>
            </ul>
        </div>
    )
}
