import { useAuth } from "../Auth/useAuth";

export const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="w-40 px-4 first:text-red-400 hover:text-red-600 font-semibold cursor-pointer"
    >
      Log Out
    </button>
  );
}
