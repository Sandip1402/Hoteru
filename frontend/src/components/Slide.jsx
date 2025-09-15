import { Card } from "./Card";

export const Slide = ({ items }) => {


  return (
    <div className="flex gap-4 snap-x snap-mandatory overflow-x-auto no-scrollbar w-full">
      {items.map((item) => (
        <div key={item._id} className="item-link flex-shrink-0 text-xs snap-center">
          <Card item={item} />
        </div>
      ))}
    </div>

  )
}
