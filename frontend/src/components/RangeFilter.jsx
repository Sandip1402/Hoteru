import { useEffect, useState } from "react";
import { Filter } from "./Filter.jsx";

export const RangeFilter = ({ name, maxVal }) => {
    const [expand, setExpand] = useState(false);
    const [value, setValue] = useState(3);

    useEffect(() => {
        // console.log(value)
    }, [value])

    return (
        <div className="w-full my-2">
            <Filter name={name} setState={{ expand, setExpand }} />
            {expand &&
                <div className="px-2 py-1">
                    <input className="range range-xs w-full text-primary bubble" type="range"
                       name={name} onChange={(ev) => setValue(ev.target.valueAsNumber)} step={1} min="1" max={`${maxVal}`} />
                    {/* <output className="bubble">{value}</output> */}
                </div>
            }
        </div>
    )
}