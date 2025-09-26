import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { ImCross } from "react-icons/im";

import { FormInput } from "./FormInput";
import { useAuth } from "./AuthContext";
import { useApiFetch } from "../util/api";

export const Signup = ({ setShowLogin, setShowSignUp }) => {
    const methods = useForm();
    const { handleSubmit } = methods;

    const { setAccessToken } = useAuth();
    const apiFetch = useApiFetch();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [checked, setChecked] = useState(false);

    const saveUser = async (data) => {
        const user = { ...data, TC: checked };

        try {
            // Try signing up
            await apiFetch('/signup', {
                method: "POST",
                body: JSON.stringify({ user }),
            });

            // If signup succeeds, auto-login
            const loginRes = await apiFetch('/login', {
                method: "POST",
                body: JSON.stringify({ user: { email: data.email, password: data.password } }),
            });

            setAccessToken(loginRes.accessToken);
            setShowSignUp(false);

        } catch (err) {
            if (err.status === 409) {
                setError(err.message);
            } else {
                setError(err.message || "Signup failed! Please try again");
            }
        }
    };

    useEffect(() => {
        const handleEscape = (ev) => {
            if (ev.key === "Escape") {
                setShowSignUp(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [setShowSignUp]);


    return (
        <FormProvider {...methods}>
            <form className="mx-auto w-max p-4 bg-white rounded-lg shadow-lg select-none relative" onSubmit={handleSubmit(saveUser)}>

                <button type="button" className="absolute top-4 cursor-pointer right-4 text-lg text-gray-400 hover:text-black"
                    onClick={() => { setShowSignUp(false) }}><ImCross />
                </button>

                {/* input fields*/}
                <FormInput name="firstname" label="Firstname" placeholder="First Name"
                    rules={{ required: "*First name is required" }} input_classes={"input-field md:text-sm"} />

                <FormInput name="lastname" label="Lastname" placeholder="Last Name"
                    rules={{ required: "*Last name is required" }} input_classes={"input-field md:text-sm"} />

                <FormInput name="email" label="Mail" placeholder="Enter mail" type="email"
                    rules={{ required: "*Mail is required" }} input_classes={"input-field md:text-sm"} />

                <div className="relative">
                    <FormInput name="password" label="Password" placeholder="Enter password"
                        rules={{ required: "*password is required", minLength: { value: 6, message: "*Password should have atleast 6 character" } }}
                        input_classes={"input-field md:text-sm"}
                        type={showPassword ? "text" : "password"} />

                    {/* password view button */}
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-8 md:top-10 text-white hover:text-gray-300 focus:outline-none">
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>

                {/* Terms and condition field */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300 mb-4">
                    <input type="checkbox" checked={checked}
                        className="checkbox checkbox-sm checkbox-primary checked:bg-[#837CE1]"
                        onChange={() => { setChecked((p) => !p) }} />
                    <span className="text-xs">I agree to the <a href="#"
                        className="underline text-[#837CE1] hover:text-[#A095D6]">Terms &amp; Conditions</a>
                    </span>
                </label>

                <button type="submit"
                    disabled={!checked}
                    className="btn btn-block btn-primary normal-case bg-[#6756CC]">
                    Sign Up
                </button>

                {/* Handle error */}
                {error ? <p className="text-red-500 text-sm mt-2">*{error}</p> : ''}

                {/* Sign up with social media */}
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

                {/* Log in option */}
                <div className="mt-4 text-sm">Already have an account?
                    <p className="inline underline text-blue-600 cursor-pointer"
                        onClick={() => { setShowSignUp(false); setShowLogin(true) }}>
                        Log In
                    </p>
                </div>
            </form>
        </FormProvider>
    )
}
