import { NavLink } from "react-router";
import {
    FaUser,
    FaShieldAlt,
    FaBuilding,
    FaBed,
    FaSignOutAlt,
} from "react-icons/fa";

export const HostProfileSideBar = ({ style = "", setFunc }) => {

    const handleClick = () => {
        if (setFunc) {
            setFunc(false);
        }
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${isActive
            ? "bg-gray-200 font-semibold"
            : "text-gray-600 hover:bg-gray-100"
        }`;

    return (
        <aside className={`bg-white rounded-lg ${style}`}>

            {/* Account */}
            <div className="mb-5">

                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    Account
                </p>

                <div className="flex flex-col gap-1">

                    <NavLink
                        to="/host/personal_info"
                        className={linkClass}
                        onClick={handleClick}
                    >
                        <FaUser size={14} />
                        <span>Personal Information</span>
                    </NavLink>

                    <NavLink
                        to="/host/security"
                        className={linkClass}
                        onClick={handleClick}
                    >
                        <FaShieldAlt size={14} />
                        <span>Security</span>
                    </NavLink>

                </div>

            </div>


            {/* Hosting */}
            <div className="mb-5">

                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    Hosting
                </p>

                <div className="flex flex-col gap-1">

                    <NavLink
                        to="/host/listings"
                        className={linkClass}
                        onClick={handleClick}
                    >
                        <FaBuilding size={14} />
                        <span>My Listings</span>
                    </NavLink>

                    <NavLink
                        to="/host/rooms"
                        className={linkClass}
                        onClick={handleClick}
                    >
                        <FaBed size={14} />
                        <span>My Rooms</span>
                    </NavLink>

                </div>

            </div>


            {/* Logout */}
            <div className="pt-3 border-t border-gray-200">

                <NavLink
                    to="/user/logout"
                    className={linkClass}
                    onClick={handleClick}
                >
                    <FaSignOutAlt size={14} />
                    <span>Logout</span>
                </NavLink>

            </div>

        </aside>
    );
};