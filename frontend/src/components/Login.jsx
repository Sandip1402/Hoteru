import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import { FormInput } from "./FormInput";
import { apiFetch } from "../js/api";

export const Login = () => {
    const methods = useForm();
    const { handleSubmit } = methods;

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null)

    const saveData = async (data) => {
        const user = { ...data };
        const res = apiFetch('/login', {
            method: "POST",
            body: JSON.stringify({ user })
        })
        if (!res.success) {
            setError(res.error);
        }
    }

    return (
        <FormProvider {...methods}>
            <form className="max-w-screen mx-auto p-4 bg-white rounded-lg shadow-lg select-none" onSubmit={handleSubmit(saveData)}>

                <FormInput name="mail" label="Mail" placeholder="Enter mail"
                    rules={{ required: "*mail is required" }} input_classes={"input-field"} />

                <div className="relative">
                    <FormInput name="pass" label="Password" placeholder="Enter password"
                        rules={{ required: "*password is required" }} input_classes={"input-field"}
                        type={showPassword ? "text" : "password"}
                    />

                    {/* password view button */}
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-8 text-white hover:text-gray-300 focus:outline-none">
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>

                <button type="submit"
                    className="btn btn-block btn-primary bg-[#837CE1] border-[#837CE1] hover:bg-[#6756CC] hover:border-[#6756CC]">
                    Log In
                </button>

                {error ? <p className="login-error">*{error}</p> : ''}

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
            </form>
        </FormProvider>
    )
}
