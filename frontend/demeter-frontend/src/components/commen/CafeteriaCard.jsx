import React from "react";

function Stars({ value = 4 }) {
  const full = Math.max(0, Math.min(5, value));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < full ? "text-yellow-500" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CafeteriaCard({ cafe }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image header */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/35 transition-opacity duration-300 group-hover:bg-black/45" />

        {/* Title + time/status */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-3xl font-extrabold text-white drop-shadow transition-transform duration-300 group-hover:translate-y-[-2px]">
            {cafe.name}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-sm text-white/95">
            <div className="flex items-center gap-2">
              <span className="text-white/90">🕒</span>
              <span className="font-medium">{cafe.hours}</span>
            </div>

            <span className="text-white/70">•</span>

            <span
              className={
                cafe.status === "Open"
                  ? "font-semibold text-green-400"
                  : "font-semibold text-red-400"
              }
            >
              {cafe.status}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 transition-colors duration-300 group-hover:bg-gray-50">
        {/* Stars */}
        <Stars value={cafe.rating} />

        {/* Description */}
        <p className="mt-4 text-gray-500">{cafe.description}</p>

        <hr className="my-5" />

        {/* Popular items */}
        <p className="text-xs font-semibold tracking-wider text-gray-500">
          POPULAR ITEMS
        </p>

        <div className="mt-3 space-y-3">
          {cafe.popularItems.map((it) => (
            <div key={it.name} className="flex items-center justify-between">
              <span className="text-gray-900">{it.name}</span>
              <span className="text-gray-500">GK {it.price}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button className="mt-6 w-full rounded-xl bg-rose-200 px-4 py-3 font-semibold text-gray-900 transition hover:bg-rose-300 active:scale-[0.98]">
          View Menu
        </button>
      </div>
    </div>
  );
}