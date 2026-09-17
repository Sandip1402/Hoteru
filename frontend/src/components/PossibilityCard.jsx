export const PossibilityCard = ({
  image,
  title,
  buttonText = "Explore",
}) => {
  return (
    <article className="group relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[16/10]">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
        <h3 className="max-w-[70%] text-xl font-semibold text-white sm:text-2xl">
          {title}
        </h3>

        <button
          type="button"
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-100 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          {buttonText}
        </button>
      </div>
    </article>
  );
};