import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";

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
import { Component } from "react";

function App() {

  const Router = createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      children: [
        {index: true, Component: Home},
        {path: "hotels", Component: Hotel},
        {path: "experiences", Component: Experiences},
        {path: "discover", Component: Discover},
        {path: "profile/:id", 
          Component: Profile,
          children: [
            {index: true, Component: Profile},
            // {path: "/settings", Component: Profile},
            // {path: "/logout", Component: Home}
          ]
          
        }
      ]
    }

  ])

  return (
    <RouterProvider router={Router} />
  )
}

export default App;
