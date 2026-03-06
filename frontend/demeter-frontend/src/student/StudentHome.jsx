import React from "react";
import FoodCard from "../components/common/FoodCard";
import CafeteriaCard from "../components/common/CafeteriaCard.jsx";

// First row (Recommended)
const recommendedItems = [
  {
    id: 1,
    name: "Neuro-Burger",
    price: 45,
    description:
      "Plant-based patty with smart-sauce and crispy sweet potato fries.",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=60",
    tag: "vegetarian",
  },
  {
    id: 2,
    name: "Quantum Quinoa Bowl",
    price: 38,
    description: "Fresh quinoa, avocado, kale, and a lemon-tahini dressing.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=60",
    tag: "vegan",
  },
  {
    id: 3,
    name: "Sunset Smoothie",
    price: 20,
    description: "Mango, pineapple, and strawberry blend with yogurt.",
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&q=60",
    tag: "drink",
  },
];

// Second row (Campus Cafeterias)
const cafeterias = [
  {
    id: 1,
    name: "Hex-Core Cafe",
    hours: "07:00 – 20:00",
    status: "Open",
    rating: 4,
    description:
      "Industrial chic meets molecular gastronomy. Fast, efficient, and futuristic.",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=60",
    popularItems: [
      { name: "Neuro-Burger", price: 45 },
      { name: "Quantum Quinoa Bowl", price: 38 },
    ],
  },
  {
    id: 2,
    name: "The Last Drop",
    hours: "08:00 – 22:00",
    status: "Busy",
    rating: 4,
    description:
      "Cozy atmosphere for deep study sessions and artisanal brews.",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=60",
    popularItems: [
      { name: "Void Latte", price: 15 },
      { name: "Scholar’s Scone", price: 12 },
    ],
  },
  {
    id: 3,
    name: "Skyline Sips",
    hours: "10:00 – 18:00",
    status: "Open",
    rating: 4,
    description: "Rooftop dining with the best view of the campus.",
    image:
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1600&q=60",
    popularItems: [
      { name: "Sunset Smoothie", price: 20 },
      { name: "High-Altitude Wrap", price: 40 },
    ],
  },
];

export default function StudentHome() {
  return (
    <div>
      {/* Welcome Section */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, Alex</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-300">
          Your next meal is just a few taps away.
        </p>
      </section>

      {/* Recommended Section */}
      <section className="mb-14">
        <h2 className="mb-6 text-xl font-semibold">✨ Recommended for You</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommendedItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Campus Cafeterias Section */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Campus Cafeterias</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cafeterias.map((cafe) => (
            <CafeteriaCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
      </section>
    </div>
  );
}