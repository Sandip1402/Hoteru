import { Navbar } from "../src/components/Navbar"
import Footer from "../src/components/Footer"
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

export default RootLayout