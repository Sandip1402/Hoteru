import { Filter } from "./Filter";
import { useState } from "react";

const BubbleFilter = ({name, options}) => {
    const [expand, setExpand] = useState(false);
    return (
        <div className={`w-full my-2`}>
            <Filter name={name} setState={{ expand, setExpand }} />
            {expand &&
                <div className="p-2 flex flex-wrap gap-2 text-center">
                    {options.map((option) => {
                       return <span className="h-max flex-1 p-2 bg-base-300 cursor-pointer hover:bg-main-color/80 hover:text-white rounded-box">
                                {option}
                            </span>
                    })}
                </div>
            }
        </div>
    )
}

export default BubbleFilter