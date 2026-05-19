import { createBrowserRouter, Navigate } from "react-router";

import { useAuth } from "./Auth/useAuth.js";

import RootLayout from '../layout/RootLayout.jsx'
import ProfileLayout from '../layout/ProfileLayout.jsx'

import { NotFound } from "./components/NotFound.jsx";
import { LoginButton } from "./components/Loginbutton.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

import { Hotel } from './pages/Hotel.jsx'
import { Home } from "./pages/Home.jsx";
import { Experiences } from './pages/Experiences.jsx'
import { Discover } from './pages/Discover.jsx'
import { Profile } from './pages/Profile.jsx'
import { Test } from "./pages/Test.jsx"
import RoomDetails from "./pages/RoomDetails.jsx";
import Payment from "./pages/Payment.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";


export const Router = createBrowserRouter([
    {
        /* fix - need to apply dynamic paths */
        path: "/",
        element: <RootLayout />,
        // errorElement:
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    { index: true, element: <Home /> },
                    {
                        path: "hotels",
                        children: [
                            { index: true, element: <Hotel /> },
                            { path: "roomdetails", element: <RoomDetails /> },
                            { path: "payment", element: <Payment /> }
                        ]
                    },
                    { path: "experiences", element: <Experiences /> },
                    { path: "discover", element: <Discover />},
                    {
                        path: "profile",
                        element: <ProfileLayout />,
                        children: [
                            { index: true, element: <Navigate to="/profile/personal_info" replace /> },
                            { path: "personal_info", element: <Profile /> },
                            { path: "security", element: <Profile />},
                            { path: "payment_info", element: <Profile /> },
                            { path: "notification", element: <Profile /> },
                            { path: "logout", element: <Profile /> }
                        ]
                    },
                    { path: "test", element:<Test />  },
                    { path: "*", element: <NotFound /> }
                ]
            }
        ]
    }

])