import { createBrowserRouter, Navigate } from "react-router";

import { RootLayout } from '../layout/RootLayout.jsx'
import { ProfileLayout } from '../layout/ProfileLayout.jsx'
import { HostProfileLayout } from "../layout/HostProfileLayout.jsx";

import { ProtectedRoute } from "./components";

import {
    Bookings, Experiences, Payment, RootCrash, Test, Discover, Home, Profile, Notification,
    WishList, ErrorPage, NotFound, RoomDetails, Security, Listings,
    ListingDetails, BookingDetails, CreateListing,
    HostListings, AddRoom,
    HostListingDetails,
    HostRoomDetails,
    EditRoom, EditListing,
    HostProfile
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
                        element: <ProtectedRoute allowedRoles={['basic_user']}><ProfileLayout /></ProtectedRoute>,
                        children: [
                            { index: true, element: <Navigate to="/user/personal_info" replace /> },
                            { path: "personal_info", element: <Profile /> },
                            { path: "security", element: <Security /> },
                            { path: "bookings", element: <Bookings /> },
                            { path: "wishlist", element: <WishList /> },
                            { path: "logout", element: <Profile /> },
                        ]
                    },
                    // {
                    //     path: "host", element: <ProtectedRoute allowedRoles={['host']}><HostProfileLayout /></ProtectedRoute>,
                    //     children: [
                    //         { index: true, element: <Navigate to="/host/personal_info" replace /> },
                    //         { path: "personal_info", element: <HostProfile /> },
                    //         { path: "security", element: <Security /> },
                    //         {
                    //             path: "listings", element: <HostListings />,
                    //             children: [
                    //                 { path: "create", element: <CreateListing /> },
                    //                 {
                    //                     path: ":listingId", element: <HostListingDetails />,
                    //                     children: [
                    //                         { path: "edit", element: <EditListing /> },
                    //                         { path: "rooms/new", element: <AddRoom /> },
                    //                     ]
                    //                 },
                    //             ]
                    //         },
                    //         // {
                    //         //     // path: "rooms", element: <HostRooms />,
                    //         //     children: [
                    //         //         {
                    //         //             path: ":roomId", element: <HostRoomDetails />,
                    //         //             children: [
                    //         //                 { path: "edit", element: <EditRoom /> },
                    //         //             ]
                    //         //         },
                    //         //     ]
                    //         // }
                    //     ]
                    // },
                    {
                        path: "host",
                        element: (
                            <ProtectedRoute allowedRoles={["host"]}>
                                <HostProfileLayout />
                            </ProtectedRoute>
                        ),
                        children: [
                            {
                                index: true,
                                element: <Navigate to="/host/personal_info" replace />
                            },

                            {
                                path: "personal_info",
                                element: <HostProfile />
                            },

                            {
                                path: "security",
                                element: <Security />
                            },

                            {
                                path: "listings",
                                element: <HostListings />
                            },

                            {
                                path: "listings/create",
                                element: <CreateListing />
                            },

                            {
                                path: "listings/:listingId",
                                element: <HostListingDetails />
                            },

                            {
                                path: "listings/:listingId/edit",
                                element: <EditListing />
                            },

                            {
                                path: "listings/:listingId/rooms/new",
                                element: <AddRoom />
                            },

                            // {
                            //     path: "rooms",
                            //     element: <HostRooms />
                            // },

                            {
                                path: "rooms/:roomId",
                                element: <HostRoomDetails />
                            },

                            {
                                path: "rooms/:roomId/edit",
                                element: <EditRoom />
                            },
                        ]
                    },
                    // { path: "host/listings", element: <HostListings /> },
                    // { path: "host/listings/create", element: <CreateListing /> },
                    // { path: "host/listings/:listingId", element: <HostListingDetails /> },
                    // { path: "host/listings/:listingId/edit", element: <EditListing /> },
                    // { path: "host/listings/:listingId/rooms/new", element: <AddRoom /> },
                    // { path: "host/rooms/:roomId", element: <HostRoomDetails /> },
                    // { path: "host/rooms/:roomId/edit", element: <EditRoom /> },
                    { path: "test", element: <Test /> },
                    { path: "*", element: <NotFound /> }
                ]
            }
        ]
    }

])