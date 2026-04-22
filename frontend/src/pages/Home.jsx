
import Search from "../components/Search"
import { Slide } from "../components/Slide"

export const Home = () => {
  return (
    <div className="flex-col justify-items-center py-4 mx-auto px-20">
      <section className="h-max">
          <Search />
        <div className="relative bottom-6">
          <Slide items={['bg1.jpg', 'bg2.jpg', 'bg3.jpg']} />
        </div>
      </section>
      <section className="justify-self-start">
        <b>POPULAR PLACES</b>

      </section>
    </div>
  )
}
