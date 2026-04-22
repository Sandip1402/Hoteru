

export const Filter = ({name, setState}) => {
    const {expand, setExpand} = setState;
    return (
        <div className={`flex p-2 rounded-box items-center cursor-pointer ${expand && "bg-base-200"} hover:bg-base-200`}
            onClick={() => setExpand(!expand)}>
            <span className="flex-1"><b>{name}</b></span>
            <img className="rotate-90" src="Icons/Chevron_right.svg" alt="down_arrow" />
        </div>
    )
}