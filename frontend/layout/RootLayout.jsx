import { Navbar } from "../src/components/Navbar"
import Footer from "../src/components/Footer"
import { Outlet } from "react-router"


const RootLayout = () => {
  return (
    <>
        <Navbar />
        <div className="flex-1 w-screen">
            <Outlet />
        </div>
        <Footer /> 
    </>
  )
}

export default RootLayout