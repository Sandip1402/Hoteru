import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Movable } from './Movable';
import { Modal } from './Modal';
import { Login } from './Login';
import { Signup } from './Signup';
import { useApiFetch } from '../util/api';
import { useAuth } from './AuthContext';


export const Navbar = () => {

    const [showLogin, setShowLogin] = useState(false);
    const [active, setActive] = useState("Home");
    const [showSignUp, setShowSignUp] = useState(false);
    const navigate = useNavigate();
    
    const { accessToken, setAccessToken } = useAuth();
    const loggedIn = !!accessToken; // converting to correct boolean
    
    const apiFetch = useApiFetch();

  const logOut = async () => {
    try {
      await apiFetch("/logout", { method: "POST" });

      // clear access token
      setAccessToken(null);
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };


    return (
        <nav className="h-35 bg-main-color/80 flex-col p-3">
            <div className="nav-top h-1/2 mb-2 flex items-center justify-between">

                <Logo customStyle="nav-top-start w-1/3" />

                <div className="nav-top-center hidden lg:w-1/3 md:flex justify-between items-center">
                        <Movable name="Hotel" />
                        <Movable name="Experience" />
                        <Movable name="Service" />
                </div>

                <div className="nav-top-end w-1/3 flex items-center justify-end">

                    <span className='md:hidden'><i className="fa-solid fa-magnifying-glass text-xl"></i></span>
                    <span className="hidden md:flex btn bg-inherit border-none rounded-3xl hover:shadow-none hover:bg-white text-lg ">Become host</span>

                    <div className="dropdown dropdown-end">
                        <div tabIndex="0" role="button"
                            className="bg-none w-10 h-10 rounded-full hover:bg-base-100 hidden md:flex items-center justify-center">
                            <i className="fa-solid fa-globe text-xl"></i>
                        </div>

                        <div tabIndex="0" role="button"
                            className="bg-none w-10 h-10 rounded-full hover:bg-base-100 flex md:hidden items-center justify-center">
                            <i className="fa-solid fa-bars text-xl"></i>
                        </div>

                        {!showLogin &&
                            <ul tabIndex="0" className="dropdown-content bg-base-100 rounded-box w-40 md:w-52 shadow-lg px-2 text-lg">
                                <div className="block md:hidden">
                                    <li className="mt-2 dropdown-item"><a>Become host</a></li>
                                    <div className="md:my-2 w-full h-0.5 bg-gray-300"></div>
                                </div>
                                <li className="md:mt-2 dropdown-item "><a>Refer host</a></li>
                                <div className="md:my-2 w-full h-0.5 bg-gray-300"></div>
                                <li className="dropdown-item"><a>Find co-host</a></li>
                                <div className="md:my-2 w-full h-0.5 bg-gray-300"></div>
                                {!loggedIn && <li className="dropdown-item mb-2"
                                    onClick={() => {setShowLogin(true);}}>
                                    Log In</li>
                                }
                                {loggedIn && <button className="btn btn-error w-full mb-2 md:my-2 px-2 hover:bg-main-color/70"
                                    onClick={logOut}>
                                    Log out</button> 
                                }
                            </ul>
                        }
                    </div>
                </div>
            </div>

            <div className="nav-bottom w-full flex h-1/2 items-center justify-center md:p-4">
                <div className="w-[50%] h-10 border-1 px-4 hidden md:flex rounded-2xl bg-[#ffffff] items-center justify-around">
                    <div className="flex items-center justify-self-start">
                        <i className="fa-solid fa-magnifying-glass text-xl"></i>
                        <div className="w-px h-6 bg-black mx-3"></div>
                    </div>
                    <form className="w-full">
                        <input id="search" type="text" placeholder="Search" className="bg-transparent text-lg outline-none w-full" />
                    </form>
                </div>
                <div className='max-md:flex hidden justify-around items-center w-full max-w-md'>
                        <Movable name="Hotel" />
                        <Movable name="Experience" />
                        <Movable name="Service" />
                </div>
            </div>
            <Modal show={showLogin}
                onClose={() => {setShowLogin(false)}}>
                    <Login setShowLogin = {setShowLogin} setShowSignUp = {setShowSignUp} />
            </Modal>
            <Modal show={showSignUp}
                onClose={() => {setShowSignUp(false)}}>
                    <Signup  setShowLogin = {setShowLogin} setShowSignUp = {setShowSignUp} />
            </Modal>
        </nav>
    )
}
