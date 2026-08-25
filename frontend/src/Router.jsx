import { createBrowserRouter, Navigate } from "react-router";

import RootLayout from '../layout/RootLayout.jsx'
import ProfileLayout from '../layout/ProfileLayout.jsx'

import { ProtectedRoute } from "./components";

import {
    Bookings, Experiences, Payment, RootCrash, Test, Discover, Home, Profile, Notification,
    SavedPayment, WishList, ErrorPage, Hostings, NotFound, RoomDetails, Security, Listings, 
    ListingDetails, BookingDetails
} from "./pages";


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
                        path: "accommodations",
                        children: [
                            { index: true, element: <Listings /> },
                            {
                                path: ":listingId",
                                children: [
                                    { index: true, element: <ListingDetails /> },
                                    { path: "rooms/:roomId", element: <RoomDetails /> },
                                ]
                            }
                        ]
                    },
                    { path: "payments/:bookingId", element: <Payment /> },
                    { path: "bookings/:bookingId", element: <BookingDetails /> },
                    { path: "experiences", element: <Experiences /> },
                    { path: "discover", element: <Discover /> },
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
                            { path: "security", element: <Security /> },
                            { path: "notification", element: <Notification /> }, // fix - need to add notification page
                            { path: "payment_info", element: <SavedPayment /> },
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