import { NavLink } from "react-router-dom"
import { FaRegSadTear } from "react-icons/fa";

export const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-dvh">
      <div>
        <div className="flex-col text-xl md:text-4xl text-center text-gray-500">
          <FaRegSadTear className="size-15 text-gray-600 mx-auto mb-4" />
          <p>404 | Page Not Found</p>
        </div>
        <p className="text-gray-700 text-lg md:text-2xl mt-2">
          <NavLink to='/hotel' className={"outline-none"}>
            &gt;&gt;Go to Home
          </NavLink>
        </p>
      </div>
    </div>
  )
}
