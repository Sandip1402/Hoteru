import { useAuth } from "../Auth/useAuth";

export const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="bg-red-500 hover:bg-red-400 rounded-full w-full text-white font-semibold py-1 px-3 cursor-pointer"
    >
      Log Out
    </button>
  );
};