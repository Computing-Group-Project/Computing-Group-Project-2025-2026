import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import StudentLayout from "../layouts/StudentLayout.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import FoodCard from "../components/common/FoodCard.jsx";
import FoodModal from "../components/common/FoodModal.jsx";

// assets
import burger from "../assets/burger.svg";
import quinoa from "../assets/submarine.svg";

export default function CafeMenu() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedFood, setSelectedFood] = useState(null);

  const filters = ["All", "Vegetarian", "Vegan", "Drink", "Healthy", "Best-Seller"];

  // MENUS FOR EACH CAFE
// MENUS FOR EACH CAFE
const cafeMenus = {
  1: {
    name: "Hex-Core Cafe",
    description:
      "Industrial chic meets molecular gastronomy. Fast, efficient, and futuristic.",
    banner:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=60",
    foods: [
      {
        id: 1,
        title: "Neuro-Burger",
        description: "Plant-based patty with smart sauce and crispy fries.",
        price: 45,
        image: burger,
        category: ["Vegetarian", "Best-Seller"],
        extras: [
          { name: "Extra Cheese", price: 5 },
          { name: "Spicy Sauce", price: 2 },
          { name: "Large Size", price: 10 },
        ],
      },
      {
        id: 2,
        title: "Quantum Quinoa Bowl",
        description: "Fresh quinoa, avocado, kale and lemon dressing.",
        price: 38,
        image: quinoa,
        category: ["Vegan", "Healthy"],
        extras: [
          { name: "Extra Cheese", price: 5 },
          { name: "Spicy Sauce", price: 2 },
          { name: "Large Size", price: 10 },
        ],
      },
    ],
  },

  2: {
    name: "The Last Drop",
    description:
      "Cozy atmosphere for deep study sessions and artisanal brews.",
    banner:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=60",
    foods: [
      {
        id: 3,
        title: "Void Latte",
        description: "Dark roasted signature coffee.",
        price: 15,
        image: burger,
        category: ["Drink"],
        extras: [
          { name: "Extra Shot", price: 3 },
          { name: "Oat Milk", price: 2 },
        ],
      },
      {
        id: 4,
        title: "Scholar’s Scone",
        description: "Fresh baked scone with butter and jam.",
        price: 12,
        image: quinoa,
        category: ["Healthy"],
        extras: [
          { name: "Extra Jam", price: 2 },
          { name: "Cream", price: 3 },
        ],
      },
    ],
  },

  3: {
    name: "Skyline Sips",
    description:
      "Rooftop dining with the best panoramic view of the campus skyline.",
    banner:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=60",
    foods: [
      {
        id: 5,
        title: "Sunset Smoothie",
        description: "Mango, pineapple and strawberry blend.",
        price: 20,
        image: burger,
        category: ["Drink"],
        extras: [
          { name: "Protein Boost", price: 5 },
          { name: "Chia Seeds", price: 3 },
        ],
      },
      {
        id: 6,
        title: "High-Altitude Wrap",
        description: "Chicken wrap with fresh veggies.",
        price: 40,
        image: quinoa,
        category: ["Healthy"],
        extras: [
          { name: "Extra Chicken", price: 8 },
          { name: "Avocado", price: 5 },
        ],
      },
    ],
  },
};

  const cafe = cafeMenus[Number(id)];

  if (!cafe) {
    return (
      <StudentLayout>
        <div className="text-white p-10 text-center">
          Cafe not found
        </div>
      </StudentLayout>
    );
  }

  const foods = cafe.foods;

  const filteredFoods = foods.filter((food) => {

    const searchMatch = food.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const filterMatch =
      filter === "All" || food.category.includes(filter);

    return searchMatch && filterMatch;
  });

  return (
    <StudentLayout>

      <div className="w-screen relative left-1/2 -translate-x-1/2 px-6">

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
          text-sm font-medium text-white
          bg-slate-800/60 backdrop-blur
          border border-slate-700
          hover:bg-slate-700
          hover:shadow-md hover:shadow-slate-900/40
          active:scale-95
          transition-all duration-200 mb-6"
        >
          <span className="text-base">&lt;</span>
          Back to Dashboard
        </button>

        {/* Banner */}
        <div className="relative w-full h-[260px] rounded-2xl overflow-hidden mb-8">

          <img
            src={cafe.banner}
            alt={cafe.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {cafe.name}
            </h1>

            <p className="mt-3 text-gray-200 max-w-2xl">
              {cafe.description}
            </p>

          </div>

        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-4 mb-8">

          <div className="flex-1">
            <SearchBar
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === item
                    ? "bg-teal-400 text-black"
                    : "border border-slate-600 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

        </div>

        {/* Food cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              image={food.image}
              title={food.title}
              description={food.description}
              price={food.price}
              badge={food.category}
              buttonText="Add"
              variant="menu"
              onClick={() => setSelectedFood(food)}
            />
          ))}

        </div>

        {selectedFood && (
          <FoodModal
            food={selectedFood}
            onClose={() => setSelectedFood(null)}
          />
        )}

      </div>

    </StudentLayout>
  );
}
