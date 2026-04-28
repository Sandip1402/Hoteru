
import Search from "../components/Search"
import { SliderBG } from "../components/SliderBG"

export const Home = () => {
  return (
    <div className="flex flex-col max-sm:p-2 sm:px-5 lg:px-20">
      <section className="sm:pt-2 w-full">
        <Search />
        <div className="sm:relative sm:bottom-6 max-sm:my-2">
          <SliderBG items={['bg0.jpg', 'bg1.jpg', 'bg2.jpg', 'bg3.jpg']} />
        </div>
      </section>
      <section >
        <b>A SIGNATURE OF EXCELLENCE</b>
      </section>
    </div>
  )
}
