import { useEffect, useState } from 'react';
import { Link, matchPath, NavLink, useNavigate } from 'react-router';

import { Logo } from './Logo';
import { Movable } from './Movable';
import { Modal } from './Modal';
import { Login } from './Login';
import { Signup } from './Signup';
import { fetchApi } from '../util/api';
import { LoginButton } from './Loginbutton';
import { LogoutButton } from './LogoutButton';
// import { useAuth } from '../context/AuthContext';


export const Navbar = () => {

    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const navigate = useNavigate();

    // const { accessToken, setAccessToken } = useAuth();
    // const loggedIn = !!accessToken; // converting to correct boolean
    const loggedIn = false;

    // const user = localStorage.getItem("user");

    // const apiFetch = fetchApi();

    // const logOut = async () => {
    //     try {
    //         await apiFetch("/logout", { method: "POST" });

    //         // clear access token
    //         setAccessToken(null);
    //         navigate("/hotel", { replace: true });

    //     } catch (err) {
    //         console.error("Logout failed:", err.message);
    //     }
    // };



    return (
        <div className="navbar bg-base-100 shadow-sm items-center">

            {/* Logo */}
            <div className="flex-none pb-1">
                <Link className="text-xl xl:text-3xl outline-none" to="/">
                    {/* <img src='/Icons/Logo.png' alt='logo' className='w-5 h-5'/> */}
                    Hoteru
                </Link>
            </div>

            {/* Options */}
            <div className="flex-1 mx-4">
                {/* { matchPath("/") ? 
                    <div className='dropdown dropdown-end' >
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">

                        </div>
                    </div>
                    :
                } */}
                    <ul className='hidden md:flex'>
                        <li><NavLink className='px-2' to="/hotels" >Places to stay</NavLink></li>
                        <li><NavLink className='px-2' to="/experiences">Experiences</NavLink></li>
                        <li><NavLink className='px-2' to="/discover">Discover</NavLink></li>
                    </ul>
            </div>

            {/* User-specific */}
            <div className="flex-none">
                {/* chats */}
                <button className="btn btn-ghost btn-circle">
                    <Link to="/profile/:id/chats" ><img src="/Icons/Message.svg" className="h-5 w-5" /></Link>
                </button>

                {/* Notifications */}
                <button className="btn btn-ghost btn-circle">
                    <Link to="/notification">
                        <div className="indicator relative top-0.5">
                            <img src="/Icons/Notification.svg" className='h-5 w-5' alt="bell_icon" />
                        </div>
                    </Link>
                </button>

                {/* Profile */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Avatar"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    {loggedIn ?
                        (<ul tabIndex="-1" className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><Link to="/profile" >Profile</Link></li>
                            <li><Link>Settings</Link></li>
                            <li><LogoutButton /></li>
                        </ul>) :
                        (<ul tabIndex="-1" className='menu dropdown-content rounded-box shadow bg-white'>
                            <li><LoginButton /></li>
                        </ul>)
                    }
                </div>
            </div>
        </div>
    )
}

// <nav className="h-35 bg-main-color/80 flex-col p-3">
//     <div className="nav-top h-1/2 mb-2 flex items-center justify-between">

//         <Logo customStyle="nav-top-start w-1/3" />

//         <div className="nav-top-end w-1/3 flex items-center justify-end">

//             <span className='md:hidden'><i className="fa-solid fa-magnifying-glass text-xl"></i></span>
//             <span className="hidden md:flex btn bg-inherit border-none rounded-3xl hover:shadow-none hover:bg-white text-lg ">Become host</span>

//             <div className="dropdown dropdown-end">
//                 <div tabIndex="0" role="button"
//                     className="bg-none w-10 h-10 rounded-full hover:bg-base-100 hidden md:flex items-center justify-center">
//                     <i className="fa-solid fa-globe text-xl"></i>
//                 </div>

//                 <div tabIndex="0" role="button"
//                     className="bg-none w-10 h-10 rounded-full hover:bg-base-100 flex md:hidden items-center justify-center">
//                     <i className="fa-solid fa-bars text-xl"></i>
//                 </div>

//                 {!showLogin &&
//                     <ul tabIndex="0" className="dropdown-content bg-base-100 rounded-box w-40 md:w-52 shadow-lg px-2 text-lg">

//                         {/* Profile button*/}
//                         {loggedIn &&
//                             (<>
//                                 <NavLink to={`/user/${user.userId}`} className='dropdown-item md:mt-2'>My Profile</NavLink>
//                                 <div className="md:my-2 w-full h-0.5 bg-gray-300"></div>
//                             </>)
//                         }

//                         <div className="block md:hidden">
//                             <li className={`dropdown-item ${loggedIn ? '' : "mt-2"}`}><a>Become host</a></li>
//                             <div className="md:my-2 w-full h-0.5 bg-gray-300"></div>
//                         </div>
//                         <li className={`dropdown-item ${loggedIn ? '' : "md:mt-2"}`}><a>Refer host</a></li>
//                         <div className="md:my-2 w-full h-0.5 bg-gray-300"></div>
//                         <li className="dropdown-item"><a>Find co-host</a></li>
//                         <div className={`md:my-2 w-full h-0.5 bg-gray-300 ${loggedIn ? "hidden" : "block"}`}></div>
//                         {!loggedIn && <li className="dropdown-item mb-2"
//                             onClick={() => { setShowLogin(true) }}>
//                             Log In</li>
//                         }
//                         {loggedIn && <button className="btn btn-error w-full mb-2 md:mt-2 px-2"
//                             onClick={logOut}>
//                             Log out</button>
//                         }
//                     </ul>
//                 } */
//             </div>
//         </div>
//     </div>

//     <div className="nav-bottom w-full flex h-1/2 items-center justify-center md:p-4">
//         <div className="w-[50%] h-10 border-1 px-4 hidden md:flex rounded-2xl bg-[#ffffff] items-center justify-around">
//             <div className="flex items-center justify-self-start">
//                 <i className="fa-solid fa-magnifying-glass text-xl"></i>
//                 <div className="w-px h-6 bg-black mx-3"></div>
//             </div>
//             <form className="w-full">
//                 <input id="search" type="text" placeholder="Search" className="bg-transparent text-lg outline-none w-full" />
//             </form>
//         </div>
//         <div className='max-md:flex hidden justify-around items-center w-full max-w-md'>
//             <Movable name="Hotel" />
//             <Movable name="Experience" />
//             <Movable name="Service" />
//         </div>
//     </div>
//     <Modal show={showLogin}
//         onClose={() => { setShowLogin(false) }}>
//         <Login setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
//     </Modal>
//     <Modal show={showSignUp}
//         onClose={() => { setShowSignUp(false) }}>
//         <Signup setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
//     </Modal>
// </nav>