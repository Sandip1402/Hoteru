export const CategoryCard = ({ image, title, description, className = "" }) => {
  return (
    <article
      className={`group relative overflow-hidden rounded-xl ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-white sm:text-xl">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-xs text-white/90 sm:text-sm">
            {description}
          </p>
        )}
      </div>
    </article>
  );
};