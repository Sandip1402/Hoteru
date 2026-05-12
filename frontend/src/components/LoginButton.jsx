import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect()}
      className="bg-primary hover:bg-primary/80 rounded-full text-white font-semibold py-1 px-3 cursor-pointer"
    >
      Login | Signup
    </button>
  );
};