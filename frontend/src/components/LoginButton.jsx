import { useAuth } from "../Auth/useAuth";

export const LoginButton = () => {

  const { loginWithRedirect } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: {
          returnTo: window.location.pathname + window.location.search
        },
      });
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-primary hover:bg-primary/80 rounded-full w-full text-white font-semibold py-1 cursor-pointer"
    >
      Login | Signup
    </button>
  )
};