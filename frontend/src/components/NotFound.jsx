import { Link, replace, useNavigate } from "react-router";
import { FaHome, FaRegSadTear } from "react-icons/fa";

export const NotFound = () => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-y-3 justify-center py-20 ">

        <div className="flex justify-center">
            <img src='/Icons/Logo.png' alt='logo' className='size-30'/>
        </div>

        <div className="flex-col text-xl md:text-4xl text-center text-gray-500">
          <FaRegSadTear className="size-15 mx-auto mb-2" />
          <p>404 | Page Not Found</p>
        </div>

        <div className="flex items-center gap-x-3 text-primary/80 text-lg md:text-2xl hover:underline cursor-pointer"
              onClick={() => navigate('/', { replace: true })}>
            <FaHome /> <p>Go to Home Page</p>
        </div>

    </div>
  )
}
