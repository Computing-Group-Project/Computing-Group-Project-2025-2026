import React from "react";

const FoodCard = ({
  image,
  title = "Food Title",
  subtitle = null,
  description = "Food description goes here.",
  price = 0,
  discount = null,
  badge = null,
  tags = null,
  preparationTime = null,
  buttonText = "Order Now",
  onClick,
  showButton = true,
  variant = "home", // home | menu
}) => {

  const isMenu = variant === "menu";

  // Calculate discounted price
  const discountedPrice = discount ? (() => {
    const val = Number(discount.discountValue);
    if (discount.discountType === 'PERCENTAGE') {
      return price - (price * val / 100);
    } else if (discount.discountType === 'FIXED_AMOUNT') {
      return Math.max(0, price - val);
    }
    return null;
  })() : null;

  const discountLabel = discount ? (() => {
    if (discount.discountType === 'PERCENTAGE') return `${discount.discountValue}% off`;
    if (discount.discountType === 'FIXED_AMOUNT') return `GK ${discount.discountValue} off`;
    return null;
  })() : null;

  return (
    <div
      onClick={isMenu ? onClick : undefined}
      className={`
      group
      w-full
      bg-white dark:bg-slate-800
      rounded-2xl
      overflow-hidden
      shadow-md
      text-gray-900 dark:text-white
      border border-gray-200 dark:border-slate-700
      transition-all duration-300
      hover:-translate-y-1
      hover:shadow-xl
      ${isMenu ? "cursor-pointer" : ""}
      `}
    >

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full ${isMenu ? "h-[180px]" : "h-[220px]"} object-cover transition-transform duration-500 group-hover:scale-110`}
        />

        {/* Badge for Home cards */}
        {!isMenu && badge && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            {badge}
          </div>
        )}

        {/* Discount badge */}
        {discountLabel && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            {discountLabel}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className={`${isMenu ? "p-4" : "p-5"} group-hover:bg-gray-50 dark:group-hover:bg-slate-700/40 transition-colors`}>

        {/* TITLE + PRICE */}
        <div className={`flex justify-between items-start ${isMenu ? "mb-1" : "mb-2"}`}>
          <h3 className={`${isMenu ? "text-base" : "text-lg"} font-semibold`}>
            {title}
          </h3>

          {isMenu && (
            <span className="text-right">
              {discountedPrice != null ? (
                <>
                  <span className="text-yellow-400 font-semibold text-sm">GK {discountedPrice.toFixed(0)}</span>
                  <span className="text-gray-400 dark:text-slate-500 text-xs line-through ml-1.5">GK {price}</span>
                </>
              ) : (
                <span className="text-yellow-400 font-semibold text-sm">GK {price}</span>
              )}
            </span>
          )}
        </div>

        {/* SUBTITLE (e.g. cafeteria name) */}
        {!isMenu && subtitle && (
          <p className="text-xs text-teal-500 dark:text-teal-400 font-medium mb-1">
            {subtitle}
          </p>
        )}

        {/* DESCRIPTION */}
        <p className={`text-gray-500 dark:text-slate-400 ${isMenu ? "text-xs mb-2" : "text-sm mb-3"}`}>
          {description}
        </p>

        {/* PREP TIME */}
        {isMenu && preparationTime && (
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">⏱ {preparationTime} min</p>
        )}

        {/* TAGS */}
        {(() => {
          const tagList = isMenu
            ? (badge ? (Array.isArray(badge) ? badge : [badge]) : null)
            : (tags && tags.length > 0 ? tags : null);
          return tagList && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {tagList.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700/60 text-gray-600 dark:text-slate-200"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          );
        })()}

        {/* HOME CARD BUTTON AREA */}
        {!isMenu && (
          <div className="flex justify-between items-center">
            <span>
              {discountedPrice != null ? (
                <>
                  <span className="text-yellow-400 font-semibold">GK {discountedPrice.toFixed(0)}</span>
                  <span className="text-gray-400 dark:text-slate-500 text-sm line-through ml-2">GK {price}</span>
                </>
              ) : (
                <span className="text-yellow-400 font-semibold">GK {price}</span>
              )}
            </span>

            {showButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                aria-label={`Order ${title}`}
                className="text-sm text-gray-700 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center gap-2"
              >
                {buttonText}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            )}
          </div>
        )}

        {/* MENU ADD BUTTON */}
        {isMenu && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            aria-label={`Add ${title} to cart`}
            className="mt-1 w-full py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-cyan-500 hover:text-white dark:hover:text-slate-900 transition text-sm font-medium"
          >
            {buttonText}
          </button>
        )}

      </div>
    </div>
  );
};

export default React.memo(FoodCard);
