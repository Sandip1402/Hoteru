import { Link } from "react-router"


export const Logo = ({customStyle}) => {
  return (
        <div className={customStyle}>
            <Link className="text-logo flex justify-self-start items-center outline-none" to="/">
                <img className="w-10 md:w-15 h-auto" src="/Icons/Logo.png" alt="logo"/>
            </Link>
        </div>
  )
}
