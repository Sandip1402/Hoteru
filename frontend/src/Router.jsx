import { createBrowserRouter, Navigate } from "react-router";

import RootLayout from '../layout/RootLayout.jsx'
import ProfileLayout from '../layout/ProfileLayout.jsx'

import { ProtectedRoute } from "./components";

import {
    Bookings, Experiences, Payment, RootCrash, Test, Discover, Home, Profile, Notification,
    WishList, ErrorPage, Hostings, NotFound, RoomDetails, Security, Listings, 
    ListingDetails, BookingDetails, CreateListing
} from "./pages";


export const Router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <RootCrash />,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    { index: true, element: <Home /> },
                    {
                        path: "accommodations",
                        children: [
                            { index: true, element: <Listings /> },
                            {
                                path: ":listingId",
                                children: [
                                    { index: true, element: <ListingDetails /> },
                                    { path: "rooms/:roomId", element: <RoomDetails /> },
                                ]
                            },
                            { path: "create", element: <CreateListing /> },
                        ]
                    },
                    { path: "payments/:bookingId", element: <Payment /> },
                    { path: "bookings/:bookingId", element: <BookingDetails /> },
                    { path: "experiences", element: <Experiences /> },
                    { path: "discover", element: <Discover /> },
                    // {path: "notification", element: <Notification />}, {/* fix - need to add notification page */}
                    // {path: "chat", element: <RootCrash />}, {/* fix - need to add chat page */}
                    {
                        path: "user",
                        element: <ProtectedRoute><ProfileLayout /></ProtectedRoute>,
                        children: [
                            { index: true, element: <Navigate to="/user/personal_info" replace /> },
                            { path: "personal_info", element: <Profile /> },
                            { path: "security", element: <Security /> },
                            { path: "bookings", element: <Bookings /> },
                            { path: "wishlist", element: <WishList /> },
                            { path: "hostings", element: <Hostings /> }, // fix : need to add separate hosting page
                            { path: "logout", element: <Profile /> }
                        ]
                    },
                    { path: "test", element: <Test /> },
                    { path: "*", element: <NotFound /> }
                ]
            }
        ]
    }

])