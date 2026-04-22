import { useEffect, useState } from "react"


export const Slide = ({ items }) => {
  const [item, setItem] = useState(items[0]);
  // useEffect(() => {
  //   items.map((item) => {
  //     setInterval(() => {
  //       setItem(item);
  //     }, 10000);
  //   })
  //   }, [item])

    return (
      <div className="flex max-w- overflow-x-auto rounded-box">
          <img src={`/${item}`} alt="bg_image" className="object-cover" />
      </div>
    )
  }