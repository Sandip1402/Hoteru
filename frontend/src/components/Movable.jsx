

const Movable = ({name, onClick, isActive}) => {



  return (
    <div className={`nav-item flex flex-col items-center mx-2 cursor-pointer relative ${isActive}`} onClick={onClick} >
        <a className="flex flex-col items-center lg:flex-row md:space-x-2" href="#">
            <img className="w-8 h-8 md:w-10 md:h-10" src={`/Icons/${name}.png`} alt={name} />
            <p className="text-gray-500 mt-1 md:mt-0">{name}</p>
        </a>
    </div>
  )
}

export default Movable