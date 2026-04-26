
import Search from "../components/Search"
// import { SliderBG } from "../components/SliderBG"

export const Home = () => {
  return (
    <div className="flex flex-col justify-items-center max-md:p-2 md:px-20 md:py-2">
      <section className="h-max w-full">
        <Search />
        <div className="md:relative md:bottom-6 max-md:my-2">
          {/* <SliderBG items={['bg.jpg', 'bg1.jpg', 'bg2.jpg', 'bg3.jpg']} /> */}
        </div>
      </section>
      <section className="w-full my-3">
        <b>A SIGNATURE OF EXCELLENCE</b>
      </section>
    </div>
  )
}
