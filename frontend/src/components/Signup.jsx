import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import { FormInput } from "./FormInput";
import { useAuth } from "./AuthContext";
import { useApiFetch } from "../util/api";

export const Signup = ({setShowSignUp, setLogin}) => {
    const methods = useForm();
    const { handleSubmit } = methods;

    const { setAccessToken } = useAuth();
    const apiFetch = useApiFetch();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [checked, setChecked] = useState(false);

    const saveUser = async (data) => {
        const user = { ...data };
        const res = await apiFetch('/signup', {
            method: "POST",
            body: JSON.stringify({ user })
        }, false)
        if (!res.success) {
            setError(res.error);
        } else {
            console.log("logged in ", user.email);
            setAccessToken(res.accessToken)
            setShowSignUp(false);
            setLogin(true);
        }
    }


    return (
        <FormProvider {...methods}>
            <form className="mx-auto min-w-75 p-4 bg-white rounded-lg shadow-lg select-none relative" onSubmit={handleSubmit(saveUser)}>

                <span className="absolute inline top-2 right-4 text-lg text-gray-400 hover:text-black"
                    onClick={() => { setShowLogin(false) }}>X
                </span>

                <FormInput name="firstname" label="Firstname" placeholder="First Name"
                    rules={{ required: "*First name is required" }} input_classes={"input-field md:text-sm"} />

                <FormInput name="lastname" label="Lastname" placeholder="Last Name"
                    rules={{ required: "*Last name is required" }} input_classes={"input-field md:text-sm"} />

                <FormInput name="email" label="Mail" placeholder="Enter mail" type="email"
                    rules={{ required: "*mail is required" }} input_classes={"input-field md:text-sm"} />

                <div className="relative">
                    <FormInput name="password" label="Password" placeholder="Enter password"
                        rules={{ required: "*password is required", length: "*password should atleast have 6 characters" }}
                        input_classes={"input-field md:text-sm"}
                        type={showPassword ? "text" : "password"} />

                    {/* password view button */}
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-8 md:top-10 text-white hover:text-gray-300 focus:outline-none">
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300 mb-4">
                    <input type="checkbox" name="check" required
                        className="checkbox checkbox-sm checkbox-primary checked:bg-[#837CE1]" 
                        onClick={() => {setChecked((p) => !p)}}/>
                    <span className="text-xs">I agree to the <a href="#"
                        className="underline text-[#837CE1] hover:text-[#A095D6]">Terms &amp; Conditions</a></span>
                </label>

                <button type="submit"
                    disabled={!checked}
                    className="btn btn-block btn-primary normal-case bg-[#6756CC]">
                    Sign Up
                </button>

                {error ? <p className="login-error">*{error}</p> : ''}

                <div className="mt-7 flex items-center justify-center gap-4 text-gray-400">
                    <div className="border-b border-gray-600 flex-grow mx-3"></div>
                    <span className="text-sm">OR</span>
                    <div className="border-b border-gray-600 flex-grow mx-3"></div>
                </div>
                <div className="mt-6 flex gap-4 max-w-md mx-auto">
                    <button aria-label="Register with Google"
                        className="btn btn-outline btn-md text-black flex-grow gap-2  hover:bg-gray-300">
                        <FcGoogle size={20} />
                        Google
                    </button>
                    <button aria-label="Register with Apple"
                        className="btn btn-outline btn-md text-black flex-grow gap-2 hover:bg-gray-300">
                        <FaFacebook size={20} className="text-blue-700" />
                        Facebook
                    </button>
                </div>

            </form>
        </FormProvider>
    )
}

{/* <div className="min-h-screen flex items-center justify-center p-4">

        <div className="w-full md:w-1/2 p-10 pb-16 rounded-r-xl text-white">
            <h1 className="text-4xl font-semibold mb-3 leading-tight">Create an account</h1>
            <p className="mb-8 text-gray-300 text-sm">
                Already have an account?
                <a href="/login" className="text-[#837CE1] underline hover:text-[#A095D6]">Log in</a>
            </p>

            <form id="signUpForm" className="space-y-6" method="post" action="/signup">
                <div className="flex gap-4">
                    <input type="text" placeholder="First name" name="user[firstname]"
                        className="input input-bordered input-md w-1/2 bg-[#241F3A] focus:outline-none focus:ring-1 focus:ring-[#837CE1] text-white"
                        required />
                    <input type="text" placeholder="Last name" name="user[lastname]"
                        className="input input-bordered input-md w-1/2 bg-[#241F3A] focus:outline-none focus:ring-1 focus:ring-[#837CE1] text-white" />
                </div>

                <input type="email" placeholder="Email" name="user[email]"
                    className="input input-bordered input-md w-full bg-[#241F3A] focus:outline-none focus:ring-1 focus:ring-[#837CE1] text-white"
                    required />

                <div className="relative w-full">
                    <input id="passwordInput" type="password" placeholder="Enter your password" name="user[password]"
                        className="input input-bordered input-md w-full bg-[#241F3A] focus:outline-none focus:ring-1 focus:ring-[#837CE1] text-white"
                        required />
                    <button type="button" id="togglePassword" tabindex="-1" aria-label="Toggle Password Visibility"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
                        <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300">
                    <input type="checkbox" name="user[check]" required
                        className="checkbox checkbox-sm checkbox-primary checked:bg-[#837CE1]" />
                    <span className="text-xs">I agree to the <a href="#"
                        className="underline text-[#837CE1] hover:text-[#A095D6]">Terms &amp; Conditions</a></span>
                </label>

                <button type="submit"
                    className="btn btn-block btn-primary bg-[#837CE1] border-[#837CE1] hover:bg-[#6756CC] hover:border-[#6756CC] normal-case">
                    Create account
                </button>
            </form>

            <div className="mt-10 flex items-center justify-center gap-4 text-gray-400">
                <div className="border-b border-gray-600 flex-grow mx-3"></div>
                <span className="text-sm">Or register with</span>
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
</div> */}
