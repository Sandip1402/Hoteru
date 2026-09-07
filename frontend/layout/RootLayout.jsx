import { Navbar, Footer } from "../src/components";
import { Outlet } from "react-router"


export const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}