import { MdOutlineLogout } from "react-icons/md";
import { NavLink } from "react-router";

import { useAuth } from "../auth/useAuth";

export const ProfileSideBar = ({
    setFunc,
    mobile = false,
}) => {
    const { logout } = useAuth();

    const sections = [
        {
            path: "/user/personal_info",
            icon: "/Icons/user-profile.svg",
            label: "Personal Details",
        },
        {
            path: "/user/security",
            icon: "/Icons/lock-alt.svg",
            label: "Security",
        },
        {
            path: "/user/bookings",
            icon: "/Icons/booking.svg",
            label: "Booking History",
        },
        {
            path: "/user/wishlist",
            icon: "/Icons/wishlist.svg",
            label: "Wishlist",
        }
    ];

    const handleLogout = () => {
        if (setFunc) {
            setFunc(false);
        }

        logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };

    return (
        <div className="
            min-w-0
            rounded-2xl
            border
            border-border
            bg-white
            p-2
        ">

            {/* Desktop heading */}
            {!mobile && (
                <div className="
                    border-b
                    border-border
                    px-3 py-4
                ">
                    <h2 className="
                        text-sm
                        font-semibold
                        text-text
                    ">
                        Account
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        text-text-muted
                    ">
                        Manage your account
                    </p>
                </div>
            )}

            {/* Navigation */}
            <nav className="
                mt-2
                space-y-1
            ">
                {sections.map((section) => (
                    <NavLink
                        key={section.path}
                        to={section.path}
                        end={
                            section.path ===
                            "/user/personal_info"
                        }
                        onClick={() =>
                            setFunc?.(false)
                        }
                        className={({ isActive }) => `
                            group
                            flex
                            min-w-0
                            items-center
                            gap-3
                            rounded-xl
                            px-3 py-2.5
                            text-sm
                            font-medium
                            transition
                            ${
                                isActive
                                    ? `
                                        bg-primary/10
                                        text-primary
                                      `
                                    : `
                                        text-text-muted
                                        hover:bg-surface
                                        hover:text-text
                                      `
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className={`
                                        flex
                                        h-9 w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        ${
                                            isActive
                                                ? "bg-primary/10"
                                                : "bg-surface"
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            h-5 w-5
                                            bg-current
                                        `}
                                        style={{
                                            maskImage: `url(${section.icon})`,
                                            maskRepeat:
                                                "no-repeat",
                                            maskPosition:
                                                "center",
                                            maskSize:
                                                "contain",
                                            WebkitMaskImage: `url(${section.icon})`,
                                            WebkitMaskRepeat:
                                                "no-repeat",
                                            WebkitMaskPosition:
                                                "center",
                                            WebkitMaskSize:
                                                "contain",
                                        }}
                                    />
                                </span>

                                <span className="
                                    min-w-0
                                    truncate
                                ">
                                    {section.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="
                mt-2
                border-t
                border-border
                pt-2
            ">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-sm
                        font-medium
                        text-red-500
                        transition
                        hover:bg-red-50
                    "
                >
                    <span className="
                        flex
                        h-9 w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                    ">
                        <MdOutlineLogout size={19} />
                    </span>

                    <span>
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
};