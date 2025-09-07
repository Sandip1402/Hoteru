

export const Logo = ({customStyle}) => {
  return (
        <div className={customStyle}>
            <a className="text-logo flex justify-self-start items-center w-full text-lg md:text-xl lg:text-2xl" href="/">
                <img className="w-[var(--logo-size)] h-auto" src="/Icons/Icon.png" alt="logo"/>
                <p className="font-medium">Hoteru</p>
            </a>
        </div>
  )
}
