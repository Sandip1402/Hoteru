
import { CardY } from "../components/CardY"
import Search from "../components/Search"
import { SliderBG } from "../components/SliderBG"

export const Home = () => {
  const items = ['bg0.jpg', 'bg1.jpg', 'bg2.jpg', 'bg3.jpg'];
  return (
    <div className="flex flex-col max-sm:p-2 sm:px-5 lg:px-20">

      <section className="max-sm:mb-3 sm:pt-2 w-full">
        <Search />
        {/* Hero Section */ }
        <div className="sm:relative sm:bottom-6 max-sm:my-2">
          <SliderBG items={['bg0.jpg', 'bg1.jpg', 'bg2.jpg', 'bg3.jpg']} />
        </div>
      </section>

      <section className="flex flex-col gap-y-2">
        <b>A SIGNATURE OF EXCELLENCE</b>
        <div className="">
          <span className="flex max-sm:gap-2 sm:gap-5">
            {items.map((item) => {
              return (<CardY key={items.indexOf(item)} item={item} />)
            })}
          </span>
        </div>
      </section>

    </div>
  )
}
