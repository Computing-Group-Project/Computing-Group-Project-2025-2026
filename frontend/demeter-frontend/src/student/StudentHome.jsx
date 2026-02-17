import React from "react";
import FoodCard from "../components/commen/FoodCard";

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

export default function StudentHome() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      {/* Welcome Section */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, Alex
        </h1>
        <p className="mt-2 text-gray-500">
          Your next meal is just a few taps away.
        </p>
      </section>

      {/* Recommended Section */}
      <section>
        <h2 className="mb-6 text-xl font-semibold">✨ Recommended for You</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommendedItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}