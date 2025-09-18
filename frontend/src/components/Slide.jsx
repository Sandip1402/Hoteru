import { Card } from "./Card";

export const Slide = ({ items }) => {


  return (
    <div className="flex snap-x gap-4 snap-mandatory overflow-x-auto no-scrollbar">
      {items.map((item) => (
        <div key={item._id} className="flex-shrink-0 text-xs snap-center overflow-hidden">
          <Card item={item} />
        </div>
      ))}
    </div>
  )
}
