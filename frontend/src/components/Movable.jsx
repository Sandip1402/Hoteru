import { NavLink, useNavigate } from "react-router-dom"


export const Movable = ({name}) => {

  
  return (
      <NavLink to={`/${name.toLowerCase()}`} className="nav-item flex flex-col items-center lg:flex-row mx-2 md:space-x-2 relative">
          <img className="w-8 h-8 md:w-10 md:h-10" src={`/Icons/${name}.png`} alt={name} />
          <p className="text-sm md:text-lg lg:text-xl mt-1 md:mt-0">{name}s</p>
      </NavLink>
  )
}