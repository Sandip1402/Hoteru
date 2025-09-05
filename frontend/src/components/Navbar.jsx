import React from 'react'

function Navbar (){
    return (
        <>
            <nav className="h-38 w-full bg-main-color/80 flex-col text-sm md:text-lg lg:text-xl">

                <div className="nav-top w-full h-1/2 px-4 md:py-4 flex items-center justify-between">

                    <div className="nav-top-start w-1/3 text-lg  md:text-xl">
                        <a className="text-logo" href="/"><i className="fa-solid fa-hotel mr-1"></i>Hoteru</a>
                    </div>

                    <div className="nav-top-center w-1/3 lg:w-max flex justify-center"> </div>

                    <div className="nav-top-end w-1/3 flex items-baseline justify-end">
                        <form className="md:hidden">
                            <i className="fa-solid fa-magnifying-glass text-xl"></i>
                        </form>
                        <form className="mx-2 hidden md:block">
                            <button className="w-auto h-auto px-2 py-1 rounded-2xl text-xl cursor-pointer hover:bg-base-100">Become a
                                host</button>
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
                </div>

            </nav>


            <div className="movable flex justify-around items-center w-full max-w-md text-sm md:text-lg lg:text-xl">

                <div className="nav-item flex flex-col items-center mx-2 cursor-pointer relative">
                    <a className="flex flex-col items-center lg:flex-row md:space-x-2" href="#">
                        <img className="w-8 h-8 md:w-10 md:h-10" src="/assets/Home.png" alt="home" />
                            <p className="text-gray-500 mt-1 md:mt-0">Homes</p>
                    </a>
                </div>


                <div className="nav-item flex flex-col items-center mx-2 cursor-pointer relative">
                    <a className="flex flex-col items-center lg:flex-row md:space-x-2" href="#">
                        <img className="w-8 h-8 md:w-10 md:h-10" src="/assets/Experience.png" alt="experience" />
                            <p className="text-gray-500 mt-1 md:mt-0">Experiences</p>
                    </a>
                </div>

                <div className="nav-item flex flex-col items-center mx-2 cursor-pointer relative">
                    <a className="flex flex-col items-center lg:flex-row md:space-x-2" href="#">
                        <img className="w-7 h-7 md:w-9 md:h-9" src="/assets/Service.png" alt="services" />
                            <p className="text-gray-500 mt-1 md:mt-0">Services</p>
                    </a>
                </div>
            </div>
        </>
    )
}
export default Navbar;