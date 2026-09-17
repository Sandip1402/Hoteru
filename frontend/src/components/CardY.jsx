export const CardY = ({ item, title, location }) => {
  return (
    <article className="group min-w-0">
      <div className="aspect-square overflow-hidden rounded-xl">
        <img
          src={item}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-3">
        <h3 className="truncate text-sm font-semibold text-text sm:text-base">
          {title}
        </h3>

        <p className="mt-1 text-xs text-text-muted sm:text-sm">
          {location}
        </p>
      </div>
    </article>
  );
};
