const FoodCard = ({
  image,
  title = "Food Title",
  description = "Food description goes here.",
  price = "GK 0",
  badge = null,
  buttonText = "Order Now",
  onClick,
  showButton = true,

  // Customization
  className = "",
  imageClassName = "",
  contentClassName = "",
  badgeClassName = "",
  priceClassName = "",
  buttonClassName = "",
}) => {
  return (
    <div
      className={`
        w-full max-w-[420px]
        bg-slate-800
        rounded-2xl
        overflow-hidden
        shadow-lg
        text-white
        transition duration-200
        ${className}
      `}
    >
      {/* IMAGE SECTION */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className={`w-full h-[220px] object-cover ${imageClassName}`}
        />

        {badge && (
          <div
            className={`
              absolute top-3 right-3
              bg-black/70
              text-white
              text-xs
              px-3 py-1
              rounded-full
              backdrop-blur-sm
              ${badgeClassName}
            `}
          >
            {badge}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className={`p-5 ${contentClassName}`}>
        <h3 className="text-lg font-semibold mb-2">
          {title}
        </h3>

        <p className="text-slate-400 text-sm mb-4">
          {description}
        </p>

        <div className="flex justify-between items-center">
          <span
            className={`text-yellow-400 font-semibold ${priceClassName}`}
          >
            {price}
          </span>

          {showButton && (
            <button
              onClick={onClick}
              className={`
                text-slate-300 text-sm
                hover:text-white
                transition
                ${buttonClassName}
              `}
            >
              {buttonText} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
