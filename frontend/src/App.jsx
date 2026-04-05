import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import { useAuth0 } from "@auth0/auth0-react"

import RootLayout from '../layout/RootLayout.jsx'
import { Hotel } from './pages/Hotel.jsx'
import { Home } from "./pages/Home.jsx";
import { Experiences } from './pages/Experiences.jsx'
import { Discover } from './pages/Discover.jsx'
// import { Service } from './pages/Service.jsx'
// import { Test } from './pages/Test.jsx'
// import { NotFound } from './components/NotFound.jsx'
// import { Payment } from './components/Payment.jsx'
import { Profile } from './pages/Profile.jsx'

function App() {

  // const Router = createBrowserRouter([
  //   {
  //     path: "/",
  //     Component: RootLayout,
  //     children: [
  //       {index: true, Component: Home},
  //       {path: "hotels", Component: Hotel},
  //       {path: "experiences", Component: Experiences},
  //       {path: "discover", Component: Discover},
  //       {path: "profile/:id", 
  //         Component: Profile,
  //         children: [
  //           {index: true, Component: Profile},
  //           // {path: "/settings", Component: Profile},
  //           // {path: "/logout", Component: Home}
  //         ]

  //       }
  //     ]
  //   }

  // ])

  // return (
  //   <RouterProvider router={Router} />
  // )
  const {
    isLoading, // Loading state, the SDK needs to reach Auth0 on load
    isAuthenticated,
    error,
    loginWithRedirect: login, // Starts the login flow
    logout: auth0Logout, // Starts the logout flow
    user, // User profile
  } = useAuth0();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return "Loading...";

  return isAuthenticated ? (
    <>
      <p>Logged in as {user.email}</p>

      <h1>User Profile</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={logout}>Logout</button>
    </>
  ) : (
    <>
      {error && <p>Error: {error.message}</p>}

      <button className="bg-red-600 m-5" onClick={signup}>Signup</button>

      <button className="bg-red-700 m-5" onClick={login}>Login</button>
    </>
  );
}

export default App;
