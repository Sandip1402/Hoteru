

export const Filter = ({name, setState}) => {
    const {expand, setExpand} = setState;
    return (
        <div className={`flex p-2 rounded-box items-center cursor-pointer ${expand && "bg-base-200 *:last:rotate-270"} hover:bg-base-200 `}
            onClick={() => setExpand(!expand)}>
            <span className="flex-1 font-bold">{name}</span>
            <img className="rotate-90 duration-500" src="/Icons/Chevron_right.svg" alt="down_arrow" />
        </div>
    )
}