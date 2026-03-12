import React from "react";
import { useNavigate } from "react-router-dom";

function Stars({ value = 4 }) {
  const full = Math.max(0, Math.min(5, value));

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < full ? "text-[#C89B3C]" : "text-[#A9C2C1]/40"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CafeteriaCard({ cafe }) {
  const navigate = useNavigate();

  if (!cafe) return null;

  return (
    <div
      className="
      group
      overflow-hidden
      rounded-2xl
      bg-white dark:bg-slate-800
      shadow-md
      transition-all duration-300
      hover:-translate-y-1
      hover:shadow-xl
      border border-gray-200 dark:border-slate-700
      "
    >

      {/* IMAGE HEADER */}
      <div className="relative h-60 w-full overflow-hidden">

        <img
          src={cafe.image}
          alt={cafe.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition" />

        {/* title */}
        <div className="absolute bottom-4 left-4 right-4">

          <h3 className="text-3xl font-extrabold text-white drop-shadow">
            {cafe.name}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-sm text-white">

            <div className="flex items-center gap-2">
              <span>🕒</span>
              <span>{cafe.hours}</span>
            </div>

            <span>•</span>

            <span
              className={
                cafe.status === "Open"
                  ? "text-teal-400 font-semibold"
                  : "text-orange-400 font-semibold"
              }
            >
              {cafe.status}
            </span>

          </div>

        </div>

      </div>


      {/* BODY */}
      <div className="p-6 transition-colors duration-300 group-hover:bg-gray-50 dark:group-hover:bg-slate-700/40">

        {/* rating */}
        <Stars value={cafe.rating} />

        {/* description */}
        <p className="mt-4 text-gray-500 dark:text-slate-400">
          {cafe.description}
        </p>

        <hr className="my-5 border-gray-200 dark:border-slate-700" />

        {/* popular items */}
        <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-slate-400">
          POPULAR ITEMS
        </p>

        <div className="mt-3 space-y-3">

          {cafe.popularItems?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <span className="text-gray-900 dark:text-white">
                {item.name}
              </span>

              <span className="text-yellow-400">
                GK {item.price}
              </span>
            </div>
          ))}

        </div>


        {/* button */}
        <button
          onClick={() => navigate(`/cafe/${cafe.id}`)}
          className="
          mt-6
          w-full
          rounded-xl
          bg-gray-100 dark:bg-slate-700
          px-4
          py-3
          font-semibold
          text-gray-900 dark:text-white
          transition
          hover:bg-cyan-500
          hover:text-white dark:hover:text-slate-900
          "
        >
          View Menu
        </button>

      </div>

    </div>
  );
}