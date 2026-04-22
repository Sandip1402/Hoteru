import { useEffect, useState } from "react";
import { Filter } from "./Filter";

export const RangeFilter = ({ name, maxVal }) => {
    const [expand, setExpand] = useState(false);
    const [value, setValue] = useState(3);
    useEffect(() => {
        // console.log(value)
    }, [value])

    return (
        <div className={`w-full my-2`}>
            <Filter name={name} setState={{ expand, setExpand }} />
            {expand &&
                <div className="px-2 py-1">
                    <input className="flex-1 outline-none range range-xs text-main-color" type="range"
                       name={`${value}`} onChange={() => setValue(value)} step="1" min="0" max={`${maxVal}`} />
                    {/* <output className="bubble">{value}</output> */}
                </div>
            }
        </div>
    )
}