import { Navbar, Footer } from "../src/components";

import { Outlet } from "react-router"


const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default RootLayout;