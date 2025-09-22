import { NavLink } from "react-router-dom"


export const Logo = ({customStyle}) => {
  return (
        <div className={customStyle}>
            <NavLink className="text-logo flex justify-self-start items-center outline-none" to="/">
                <img className="w-10 md:w-15 h-auto" src="/Icons/Icon.png" alt="logo"/>
                <p className="font-medium">Hoteru</p>
            </NavLink>
        </div>
  )
}
