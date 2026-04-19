import { useState } from "react";
import { Filter } from "./Filter";


export const CheckFilter = ({ name, options, showOptions }) => {

    const [expand, setExpand] = useState(showOptions)
    // function expand_rotate(ev) {
    //     setExpand(!expand);
    //     console.log(typeof(ev.nextElementSibling.className));
    //     if(expand){
    //         ev.nextElementSibling.className += "rotate-90"
    //     }else{
    //         ev.nextElementSibling.className 
    //     }
    //     // console.dir(ev.nextElementSibling.className);
    //     // ev.nextElementSibling.style["rotate"] = 180;
    //     console.dir(ev.nextElementSibling.style["rotate"]);
    // }

    return (
        <div className={`w-full my-2`}>
            <Filter name={name} setState={{expand, setExpand}} />
            {expand &&
                <ul className="px-2" >
                    {options.map((option) => {
                        return (
                            <li className="flex my-1 gap-2" key={options.indexOf(option)}>
                                <input type="checkbox" id={options.indexOf(option)} />
                                <label className="flex-1 cursor-pointer" htmlFor={options.indexOf(option)}>{option}</label>
                            </li>
                        )
                    })}
                </ul>
            }
        </div>
    )
}