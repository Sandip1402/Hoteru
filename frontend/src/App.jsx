import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router";
import { useAuth } from "./hooks/useAuth.js";

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
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/" replace/>;
}

function App() {

  {/* fix - need to apply path variables */}
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {index: true, element: <Home />},
        {path: "hotels",
          children: [
            {index: true, element: <Hotel />},
            {path: "/hotels/roomdetails", element: <RoomDetails />},
            {path: "/hotels/payment", element: <Payment />}
          ]
        },
        {path: "experiences", element: <Experiences />},
        {path: "discover", element: <Discover />},
        {path: "profile", element: <ProfileLayout />,
          children: [
            {index: true, element: <Navigate to="/profile/personal_info" replace />},
            {path: "/profile/personal_info", element: (<ProtectedRoute> <Profile /> </ProtectedRoute>)},
            {path: "/profile/security", element: (<ProtectedRoute> <Profile /> </ProtectedRoute>)},
            {path: "/profile/payment_info", element: (<ProtectedRoute> <Profile /> </ProtectedRoute>)},
            {path: "/profile/notification", element: (<ProtectedRoute> <Profile /> </ProtectedRoute>)},
            {path: "/profile/logout", element: (<ProtectedRoute> <Profile /> </ProtectedRoute>)}
          ]
        },
        {path: "test", element: <Test />}
      ]
    }

  ])

  return (
    <RouterProvider router={Router} />
  )
}

export default App;
