import { Navbar } from "../src/components/Navbar"
import Footer from "../src/components/Footer"
import { Outlet } from "react-router-dom"


const RootLayout = () => {
  return (
    <>
        <Navbar />
        <div className="flex justify-center items-start min-h-screen w-screen">
            <Outlet />
        </div>
        <Footer />
    </>
  )
}

export default RootLayout