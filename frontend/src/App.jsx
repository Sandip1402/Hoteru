import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router";
import { useAuth0 } from "@auth0/auth0-react"

import RootLayout from '../layout/RootLayout.jsx'
import ProfileLayout from '../layout/ProfileLayout.jsx'
import { Hotel } from './pages/Hotel.jsx'
import { Home } from "./pages/Home.jsx";
import { Experiences } from './pages/Experiences.jsx'
import { Discover } from './pages/Discover.jsx'
import { Profile } from './pages/Profile.jsx'
import RoomDetails from "./pages/RoomDetails.jsx";
import { Test } from "./pages/Test.jsx"
import Payment  from "./pages/Payment.jsx";


function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/" replace/>;
}

function App() {

  {/* fix - need to apply path variables */}
  const Router = createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      children: [
        {index: true, Component: Home},
        {path: "hotels",
          children: [
            {index: true, Component: Hotel},
            {path: "/hotels/roomdetails", Component:RoomDetails},
            {path: "/hotels/payment", Component:Payment}
          ]
        },
        {path: "experiences", Component: Experiences},
        {path: "discover", Component: Discover},
        {path: "profile", Component: ProfileLayout,
          children: [
            {index: true, element: <Navigate to="/profile/personal_info" replace />},
            {path: "/profile/personal_info", Component: Profile},
            {path: "/profile/security", Component: Profile},
            {path: "/profile/payment_info", Component: Profile},
            {path: "/profile/notification", Component: Profile},
            {path: "/profile/logout", Component: Profile}
          ]
        },
        {path: "test", Component: Test}
      ]
    }

  ])

  return (
    <RouterProvider router={Router} />
  )
}

export default App;
