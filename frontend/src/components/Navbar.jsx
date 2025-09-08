import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import Movable from './Movable';


const Navbar = () => {

  const [active, setActive] = useState("Home");

  const menuItems = ['Home', 'Experience', 'Service'];

    return (
        <>
            <nav className="h-auto w-full bg-main-color/80 flex-col text-sm md:text-lg lg:text-xl pb-3">
                <div className="nav-top w-full h-1/2 p-4 flex items-center justify-between">

                    <Logo customStyle="nav-top-start w-1/3"/>

                    <div className="nav-top-center hidden lg:w-1/3 md:flex justify-between items-center">
                        {menuItems.map((item) => (
                            <Movable key={item} name={item} />
                        ))}
                    </div>

                    <div className="nav-top-end w-1/3 flex items-center justify-end">
                        
                        <form className='md:hidden'>
                            <i className="fa-solid fa-magnifying-glass text-xl"></i>
                        </form>
                        <form className=" hidden md:block">
                            <button className="px-2 py-1 rounded-2xl whitespace-nowrap cursor-pointer hover:bg-base-100">Become host</button>
                        </form>

                        <div className="dropdown dropdown-end">
                            <div tabIndex="0" role="button"
                                className="bg-none w-10 h-10 rounded-full hover:bg-base-100 hidden md:flex items-center justify-center"><i
                                    className="fa-solid fa-globe text-xl"></i></div>

                            <div tabIndex="0" role="button"
                                className="bg-none w-10 h-10 rounded-full hover:bg-base-100 flex md:hidden items-center justify-center"><i
                                    className="fa-solid fa-bars text-xl"></i></div>

                            <ul tabIndex="0" className="dropdown-content bg-base-100 rounded-box z-1 w-40 md:w-52 border-2 border-main-color px-2 text-lg">
                                <div className="block md:hidden">
                                    <li className="my-2 px-2 cursor-pointer hover:bg-base-100"><a>Become a host</a></li>
                                    <div className="w-full h-0.5 bg-gray-300"></div>
                                </div>
                                <li className="my-2 px-2 cursor-pointer hover:bg-main-color/70"><a>Refer a host</a></li>
                                <div className="w-full h-0.5 bg-gray-300"></div>
                                <li className="my-2 px-2 cursor-pointer hover:bg-main-color/70"><a>Find a co-host</a></li>
                                <div className="w-full h-0.5 bg-gray-300"></div>
                                <li className="my-2 px-2 cursor-pointer hover:bg-main-color/70"><a href="/signup">Log In/Sign up</a></li>
                                <form method="post" action="/logout">
                                    <button className="btn btn-error my-2 px-2 cursor-pointer hover:bg-main-color/70">Log out</button>
                                </form>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="nav-bottom w-full flex h-1/2 items-center justify-center">
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
                        {menuItems.map((item) => (
                            <Movable key={item} name={item} isActive={active === item ? "active" : ""} onClick={() => setActive(item)} />
                        ))}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;