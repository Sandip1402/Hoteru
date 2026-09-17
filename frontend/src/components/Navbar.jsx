import { Link, useNavigate, NavLink } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";

import { LoginButton } from "./LoginButton.jsx";
import { LogoutButton } from "./LogoutButton.jsx";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useHoteruAuth();

  return (
    <header className="w-full border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="shrink-0">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-logo outline-none"
          >
            Hoteru
          </Link>
        </div>

        {/* Navigation */}
        <nav className="ml-10 flex-1">
          <ul className="hidden items-center gap-7 md:flex">
            <li>
              <NavLink
                to="/accommodations"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text"
                  }`
                }
              >
                Places to stay
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/experiences"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text"
                  }`
                }
              >
                Experiences
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/discover"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text"
                  }`
                }
              >
                Discover
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1">

          {/* Chat */}
          <Link
            to="/user/:id/chats"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
            aria-label="Messages"
          >
            <img
              src="/Icons/message.svg"
              alt=""
              className="h-5 w-5"
            />
          </Link>

          {/* Offers */}
          <Link
            to="/offers"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
            aria-label="Offers"
          >
            <img
              src="/Icons/offers.svg"
              alt=""
              className="h-5 w-5"
            />
          </Link>

          {/* Profile */}
          <div className="dropdown dropdown-end ml-1">
            <div
              tabIndex={0}
              role="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white p-0.5"
            >
              <img
                alt="Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <ul
              tabIndex={-1}
              className="dropdown-content z-50 mt-2 w-44 rounded-xl border border-border bg-white p-2 shadow-lg"
            >
              {isAuthenticated ? (
                <>
                  <li>
                    <button
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-text transition hover:bg-gray-50 hover:text-primary"
                      onClick={() => navigate("/user")}
                    >
                      Profile
                    </button>
                  </li>

                  <li>
                    <button
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-text transition hover:bg-gray-50 hover:text-primary"
                      onClick={() => navigate("/host")}
                    >
                      Host Profile
                    </button>
                  </li>

                  <li className="my-1 border-t border-border" />

                  <li>
                    <LogoutButton />
                  </li>
                </>
              ) : (
                <li>
                  <LoginButton />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};