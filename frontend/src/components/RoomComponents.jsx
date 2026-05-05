import { FiStar } from "react-icons/fi"

export const Review = ({style}) => {
    return (
        <span className={`flex items-center gap-1 ${style}`}>
            <FiStar strokeWidth={"0"} fill="blue" />
            <p>3.5</p>
            <p className="text-gray-500">(234 reviews)</p>
        </span>
    )
}

export const Amenities = ({ style }) => {
    const amenities = ['2bed', '4guests', '2baths', 'Air Conditioning', 'Kitchen']
    return (
        <ul className={`flex text-xs flex-wrap gap-1 ${style}`} >
            {/* fix - have to adjust to show only first 3/4 depending on screen */}
            {amenities.map((e) => {
                return (<li key={amenities.indexOf(e)}>{e}</li>)
            })}
        </ul>
    )
}