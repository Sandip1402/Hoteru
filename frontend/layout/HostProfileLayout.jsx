import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { FaChevronLeft, FaHamburger } from 'react-icons/fa';

import { HostProfileSideBar } from '../src/components';

export const HostProfileLayout = () => {

    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile sidebar whenever route changes
    useEffect(() => {
        setShow(false);
    }, [location.pathname]);

    return (
        <div className="relative max-md:p-3 md:p-5 lg:px-25">

            {/* Back button */}
            <span
                onClick={() => navigate(-1)}
                className="hidden sm:flex items-center w-max
                           text-gray-500 cursor-pointer hover:underline"
            >
                <FaChevronLeft size={10} />
                Back
            </span>

            {/* Menu & Heading */}
            <span className="flex text-xl items-center gap-x-2 md:my-2">

                <span
                    className="sm:hidden"
                    onClick={() => setShow(!show)}
                >
                    <FaHamburger size={15} />
                </span>

                <p className="sm:font-bold">
                    Host Dashboard
                </p>

            </span>

            {/* Sidebar + Content */}
            <div
                className="
                    sm:flex
                    sm:p-3
                    lg:p-5
                    2xl:p-10
                    sm:gap-x-3
                    lg:gap-x-5
                    2xl:gap-x-10
                    sm:bg-gray-100
                    rounded-box
                "
            >

                {/* Mobile sidebar */}
                {show && (
                    <HostProfileSideBar
                        setFunc={setShow}
                        style="
                            sm:hidden
                            absolute
                            z-10
                            py-2
                            px-4
                            shadow-md
                            w-60
                            *:last:gap-y-4
                        "
                    />
                )}

                {/* Desktop sidebar */}
                <HostProfileSideBar
                    style="
                        hidden
                        sm:block
                        h-max
                        sm:w-3/10
                        max-w-80
                        sm:p-3
                        lg:p-5
                        2xl:p-10
                        *:last:gap-y-5
                        shadow-md
                    "
                />

                {/* Page */}
                <Outlet />

            </div>
        </div>
    );
};