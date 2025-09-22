import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import { FormInput } from "./FormInput";
import { useApiFetch } from "../util/api";
import { useAuth } from "./AuthContext";

export const Login = ({ setShowLogin, setShowSignUp }) => {
    const methods = useForm();
    const { handleSubmit } = methods;

    const { setAccessToken } = useAuth();
    const apiFetch = useApiFetch();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null)

    const checkData = async (data) => {
        const user = { ...data };
        const res = await apiFetch('/login', {
            method: "POST",
            body: JSON.stringify({ user })
        })
        if (!res.success) {
            setError(res.message);
        } else {
            setAccessToken(res.accessToken)
            setShowLogin(false);
        }
    }

    return (
        <FormProvider {...methods}>
            <form className="mx-auto p-4 bg-white rounded-lg shadow-lg select-none relative" onSubmit={handleSubmit(checkData)}>

                <button className="absolute cursor-pointer top-4 right-4 text-lg text-gray-400 hover:text-black"
                    onClick={() => { setShowLogin(false) }}><ImCross />
                </button>

                <FormInput name="email" label="Mail" placeholder="Enter mail" type="email"
                    rules={{ required: "*mail is required" }} input_classes={"input-field md:text-sm"} />

                <div className="relative">
                    <FormInput name="password" label="Password" placeholder="Enter password"
                        rules={{ required: "*password is required" }} input_classes={"input-field md:text-sm"}
                        type={showPassword ? "text" : "password"}
                    />

                    {/* password view button */}
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-8 md:top-10 text-white hover:text-gray-300 focus:outline-none">
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>

                <button type="submit"
                    className="btn btn-block btn-primary bg-[#837CE1] border-[#837CE1] hover:bg-[#6756CC] hover:border-[#6756CC]">
                    Log In
                </button>

                {error ? <p className="text-red-700 text-sm">*{error}</p> : ''}

                <div className="mt-10 flex items-center justify-center gap-4 text-gray-400">
                    <div className="border-b border-gray-600 flex-grow mx-3"></div>
                    <span className="text-sm">Or LogIn with</span>
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

                {/* sign up option */}
                <div className="mt-4 text-sm">Didn't have an account?
                    <p className="inline underline text-blue-600 cursor-pointer"
                        onClick={() => {setShowSignUp(true); setShowLogin(false)}}>
                        Sign Up
                    </p>
                </div>
            </form>
        </FormProvider>
    )
}
