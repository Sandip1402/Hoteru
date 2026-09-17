import { Search, SliderBG } from "../components";
import { CardY, PossibilityCard, CategoryCard } from "../components";

export const Home = () => {
  const heroImages = [
    "/bg0.jpg",
    "/bg1.jpg",
    "/bg2.jpg",
    "/bg3.jpg",
  ];

  return (
    <main className="w-full bg-white">

      {/* Hero */}
      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative pt-4 sm:pt-14">

          {/* Search */}
          <div
            className="
        relative z-20
        w-full
        sm:absolute sm:left-1/2 sm:top-0
        sm:w-[calc(100%-32px)]
        sm:max-w-[1100px]
        sm:-translate-x-1/2
      "
          >
            <Search />
          </div>

          {/* Hero */}
          <div className="pt-4 sm:pt-2">
            <SliderBG items={heroImages} />
          </div>

        </div>
      </section>
      
      {/* Signature of Excellence */}
      <section className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        <div className="mb-6">
          <h2 className="text-base font-semibold tracking-wide text-text">
            A SIGNATURE OF EXCELLENCE
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">

          <CardY
            item="bg0.jpg"
            title="Mountain Escape"
            location="Manali, India"
          />

          <CardY
            item="bg1.jpg"
            title="Beach Retreat"
            location="Goa, India"
          />

          <CardY
            item="bg2.jpg"
            title="Forest Hideaway"
            location="Coorg, India"
          />

          <CardY
            item="bg3.jpg"
            title="Luxury Stay"
            location="Udaipur, India"
          />

        </div>

      </section>

      {/* Featured categories */}
      <section className="mx-auto max-w-[1200px] px-4 pb-10 sm:px-6 sm:pb-16 lg:px-8">

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">

          <CategoryCard
            image="bg0.jpg"
            title="Outdoor getaways"
            description="Reconnect with nature"
            className="aspect-square sm:row-span-2 sm:aspect-[3/4]"
          />

          <CategoryCard
            image="bg1.jpg"
            title="Unique destinations"
            description="Places worth discovering"
            className="aspect-square"
          />

          <CategoryCard
            image="bg2.jpg"
            title="Entire homes"
            description="Your own private space"
            className="aspect-square"
          />

          <CategoryCard
            image="bg3.jpg"
            title="Pet allowed"
            description="Bring your best friend"
            className="aspect-square sm:row-span-2 sm:aspect-[3/4]"
          />

        </div>

      </section>

      {/* Find new possibilities */}
      <section className="mx-auto max-w-[1320px] px-4 pb-10 sm:px-6 sm:pb-16 lg:px-8">

        <h2 className="mb-5 text-base font-semibold tracking-wide text-text">
          FIND NEW POSSIBILITIES
        </h2>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">

          <PossibilityCard
            image="bg0.jpg"
            title="Discover stays made for unforgettable moments"
            buttonText="Explore stays"
          />

          <PossibilityCard
            image="bg3.jpg"
            title="Find your next escape"
            buttonText="Discover"
          />

        </div>

      </section>
    </main>
  );
};