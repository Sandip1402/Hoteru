import { Filter } from "./Filter.jsx";
import { useState } from "react";

export const BubbleFilter = ({name, options}) => {
    const [expand, setExpand] = useState(false);
    return (
        <div className="w-full my-2">
            <Filter name={name} setState={{ expand, setExpand }} />
            {expand &&
                <div className="p-2 flex flex-wrap gap-2 text-center">
                    {options.map((option) => {
                       return <span className="flex-1 p-2 bg-base-300 rounded-box cursor-pointer hover:bg-primary/80 hover:text-white">
                                {option}
                            </span>
                    })}
                </div>
            }
        </div>
    )
}
