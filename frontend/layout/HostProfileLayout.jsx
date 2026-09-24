import { useEffect, useState } from "react";
import {
    FaChevronLeft,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router";

import { HostProfileSideBar } from "../src/components";
import { useHoteruAuth } from "../src/auth/HoteruAuthProvider.jsx";

export const HostProfileLayout = () => {
    const [show, setShow] = useState(false);

    const { isLoading } = useHoteruAuth();

    const navigate = useNavigate();
    const location = useLocation();

    /*
     * Close mobile sidebar whenever
     * the route changes.
     */
    useEffect(() => {
        setShow(false);
    }, [location.pathname]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white">
                <div
                    className="
                        mx-auto
                        max-w-[1320px]
                        px-4 py-8
                        sm:px-6
                        lg:px-8
                    "
                >
                    <p className="text-sm text-text-muted">
                        Loading host dashboard...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1320px]
                    min-w-0
                    px-4 py-6
                    sm:px-6
                    lg:px-8
                    lg:py-8
                "
            >

                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="
                        hidden
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-text-muted
                        transition
                        hover:text-text
                        sm:inline-flex
                    "
                >
                    <FaChevronLeft size={10} />
                    Back
                </button>

                {/* Header */}
                <div
                    className="
                        mb-6
                        flex
                        items-center
                        gap-3
                        sm:mb-8
                        sm:mt-3
                    "
                >

                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={() => setShow(true)}
                        aria-label="Open host dashboard menu"
                        className="
                            flex
                            h-9 w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-border
                            bg-white
                            text-text
                            transition
                            hover:bg-surface
                            lg:hidden
                        "
                    >
                        <FaBars size={14} />
                    </button>

                    <div>
                        <h1
                            className="
                                text-xl
                                font-semibold
                                text-text
                                sm:text-2xl
                            "
                        >
                            Host Dashboard
                        </h1>

                        <p
                            className="
                                mt-1
                                hidden
                                text-sm
                                text-text-muted
                                sm:block
                            "
                        >
                            Manage your listings, rooms
                            and hosting activities.
                        </p>
                    </div>
                </div>

                {/* Dashboard */}
                <div
                    className="
                        grid
                        min-w-0
                        gap-6
                        lg:grid-cols-[260px_minmax(0,1fr)]
                        xl:grid-cols-[280px_minmax(0,1fr)]
                    "
                >

                    {/* Desktop sidebar */}
                    <aside
                        className="
                            hidden
                            min-w-0
                            lg:block
                        "
                    >
                        <HostProfileSideBar />
                    </aside>

                    {/* Content */}
                    <section className="min-w-0">
                        <Outlet />
                    </section>

                </div>
            </div>

            {/* Mobile backdrop */}
            {show && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/30
                        lg:hidden
                    "
                    onClick={() => setShow(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    w-[280px]
                    max-w-[85vw]
                    overflow-y-auto
                    bg-white
                    shadow-xl
                    transition-transform
                    duration-300
                    lg:hidden
                    ${
                        show
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* Mobile sidebar header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-border
                        px-5 py-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-base
                                font-semibold
                                text-text
                            "
                        >
                            Host Dashboard
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-text-muted
                            "
                        >
                            Manage your hosting
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShow(false)}
                        aria-label="Close host dashboard menu"
                        className="
                            flex
                            h-8 w-8
                            items-center
                            justify-center
                            rounded-full
                            text-text-muted
                            transition
                            hover:bg-surface
                            hover:text-text
                        "
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                <div className="p-4">
                    <HostProfileSideBar
                        mobile
                        setFunc={setShow}
                    />
                </div>

            </aside>
        </main>
    );
};