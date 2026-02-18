import React from "react";

export default function FoodCard({ item }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 dark:text-white shadow-md transition hover:shadow-lg">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />

        {/* Category badge */}
        {item.tag && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
            {item.tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
        <p className="mt-2 text-sm text-gray-500">{item.description}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="font-semibold text-yellow-600 dark:text-yellow-400">GK {item.price}</span>
          <button className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white">
            Order Now →
          </button>
        </div>
      </div>
    </div>
  );
}