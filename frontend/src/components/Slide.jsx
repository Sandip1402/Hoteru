export const Slide = ({ item }) => {
  return (
    <div className="relative h-[300px] overflow-hidden rounded-2xl sm:h-[480px] lg:h-[540px]">
      <img
        src={item}
        alt="Hoteru destination"
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Awaken to a different world
        </h1>
      </div>
    </div>
  );
};