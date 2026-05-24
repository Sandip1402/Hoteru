import { createBrowserRouter, Navigate } from "react-router";

import { useAuth } from "./Auth/useAuth.js";

import RootLayout from '../layout/RootLayout.jsx'
import ProfileLayout from '../layout/ProfileLayout.jsx'

import { ProtectedRoute } from "./components";

import { Bookings, Experiences,  Hotel, Payment, RootCrash, Test, Discover, Home, Profile, Notification,
        SavedPayment, WishList, ErrorPage, Hostings, NotFound, RoomDetails, Security } from "./pages";



export const Router = createBrowserRouter([
    {
        /* fix - need to apply dynamic paths */
        path: "/",
        element: <RootLayout />,
        errorElement: <RootCrash />,
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
                    // {path: "notification", element: <Notification />}, {/* fix - need to add notification page */}
                    // {path: "chat", element: <RootCrash />}, {/* fix - need to add chat page */}
                    {
                        path: "profile",
                        element: <ProtectedRoute><ProfileLayout /></ProtectedRoute>,
                        children: [
                            { index: true, element: <Navigate to="/profile/personal_info" replace /> },
                            { path: "personal_info", element: <Profile /> },
                            { path: "wishlist", element: <WishList /> },
                            { path: "booking_history", element: <Bookings /> },
                            { path: "hostings", element: <Hostings /> }, // fix : need to add separate hosting page
                            { path: "security", element: <Security />},
                            { path: "notification", element: <Notification />}, // fix - need to add notification page
                            { path: "payment_info", element: <SavedPayment /> },
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