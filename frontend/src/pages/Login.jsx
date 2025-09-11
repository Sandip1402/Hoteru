import React from 'react'

export const Login = () => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-7xl w-full bg-main-color rounded-xl flex overflow-hidden shadow-xl shadow-gray-900/50">

                    <div className="hidden md:flex md:flex-col justify-between w-1/2 rounded-l-xl p-3 relative">

                        <div className="hidden md:fixed z-1">
                            <img className="w-10 h-10" src="/assets/icon.png" title="logo" />
                        </div>


                        <div className="relative flex-grow rounded-md overflow-hidden bg-gradient-to-tr from-[#5C5696] to-[#463E7E]">

                            <div className="w-full h-full md:flex items-center justify-center text-white text-center px-6">
                                <div>
                                    <p className="text-2xl font-normal">
                                        Capturing Moments,<br />Creating Memories
                                    </p>
                                    <div className="indicator-dots mt-6">
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot active"></span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <button type="button"
                            className="absolute top-6 right-6 btn btn-sm btn-outline btn-secondary rounded-full gap-1 normal-case hover:bg-[#6756CC]/80 transition duration-300"
                            onclick="window.location.href='/home'">
                            Back to website <span aria-hidden="true">→</span>
                        </button>
                    </div>


                    <div className="w-full md:w-1/2 p-10 pb-16 rounded-r-xl text-white">
                        <form id="logInForm" className="space-y-6" method="post" action="/login">

                            <input id="emailInput" type="email" placeholder="Email" name="user[email]"
                                className="input input-bordered input-md w-full bg-[#241F3A] text-white focus:outline-none focus:ring-1 focus:ring-[#837CE1]"
                                required />

                            <div className="relative w-full">
                                <input id="passwordInput" type="password" placeholder="Enter your password" name="user[pass]"
                                    className="input input-bordered input-md w-full bg-[#241F3A] text-white focus:outline-none focus:ring-1 focus:ring-[#837CE1]"
                                    required />

                                <button type="button" id="togglePassword" tabindex="-1" aria-label="Toggle Password Visibility"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
                                    <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>

                            <button type="submit"
                                className="btn btn-block btn-primary bg-[#837CE1] border-[#837CE1] hover:bg-[#6756CC] hover:border-[#6756CC] normal-case">
                                Log In
                            </button>

                            {error !== undefined && <p className="login-error">*{error}</p>}

                        </form>

                        <div className="mt-10 flex items-center justify-center gap-4 text-gray-400">
                            <div className="border-b border-gray-600 flex-grow mx-3"></div>
                            <span className="text-sm">Or LogIn with</span>
                            <div className="border-b border-gray-600 flex-grow mx-3"></div>
                        </div>

                        <div className="mt-6 flex gap-4 max-w-md mx-auto">
                            <button aria-label="Register with Google"
                                className="btn btn-outline btn-md text-white flex-grow gap-2 normal-case hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
                                    <path fill="#FFC107"
                                        d="M43.611 20.083h-1.124v-.083H24v7.83h11.362c-1.244 3.925-4.713 6.742-8.977 6.742-5.435 0-9.848-4.57-9.848-10.203 0-5.631 4.413-10.201 9.848-10.201 2.44 0 4.67.971 6.355 2.562l5.031-4.851C34.36 12.173 29.34 10 24 10 14.4 10 6.53 17.99 6.53 27.414 6.53 36.823 14.4 44.792 24 44.792c10.229 0 18.103-8.275 18.103-18.367 0-1.236-.16-2.479-.492-3.342z" />
                                    <path fill="#FF3D00"
                                        d="M6.53 27.414l6.764-4.973c-.297-1.055-.47-2.155-.47-3.297v-.047L6.53 27.41z" />
                                    <path fill="#4CAF50"
                                        d="M24 44.792c5.196 0 9.606-1.713 12.809-4.655l-6.191-5.676c-1.65 1.105-3.775 1.771-6.618 1.771-4.347 0-8.044-2.938-9.378-6.898L6.53 35.4C9.713 40.184 16.24 44.792 24 44.792z" />
                                    <path fill="#1976D2"
                                        d="M43.611 20.083h-1.124v-.083H24v7.83h11.362c-.48 1.535-1.522 2.916-3.102 3.796l6.191 5.676c3.634-3.327 5.658-8.28 5.658-14.346 0-1.236-.16-2.479-.492-3.342z" />
                                </svg>
                                Google
                            </button>
                            <button aria-label="Register with Apple"
                                className="btn btn-outline btn-md text-white flex-grow gap-2 normal-case hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 30 30" fill="currentColor">
                                    <path
                                        d="M24.615 19.89c-.014-3.52 2.867-5.2 2.996-5.278-1.634-2.386-4.172-2.717-5.07-2.753-2.15-.217-4.188 1.27-5.28 1.27-1.096 0-2.78-1.233-4.577-1.2-2.352.034-4.516 1.363-5.73 3.46-2.441 4.234-.623 10.5 1.75 13.955 1.168 1.79 2.56 3.796 4.386 3.726 1.78-.068 2.448-1.142 4.6-1.142 2.14 0 2.757 1.142 4.627 1.108 1.9-.034 3.092-1.815 4.256-3.609 1.348-1.924 1.906-3.78 1.928-3.872-.042-.02-3.685-1.412-3.7-5.604ZM20.848 9.16c.872-1.058 1.463-2.53 1.303-3.99-1.262.05-2.788.84-3.678 1.898-.808.947-1.512 2.48-1.322 3.93 1.4.105 2.84-.707 3.697-1.838Z" />
                                </svg>
                                Apple
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
