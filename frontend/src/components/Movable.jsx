import { NavLink, useNavigate } from "react-router-dom"


const Movable = ({name}) => {

  const page = name === 'Home'? '' : name;
  
  return (
      <NavLink to={`/${page}`} className="nav-item flex flex-col items-center lg:flex-row mx-2 md:space-x-2 relative">
          <img className="w-8 h-8 md:w-10 md:h-10" src={`/Icons/${name}.png`} alt={name} />
          <p className="text-gray-500 mt-1 md:mt-0">{name}s</p>
      </NavLink>
  )
}

export default Movable