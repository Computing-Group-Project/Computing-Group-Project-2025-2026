import React from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "../components/common/FoodCard.jsx";
import CafeteriaCard from "../components/common/CafeteriaCard.jsx";
import StudentLayout from "../layouts/StudentLayout.jsx";
import quinoa from "../assets/submarine.svg";
import burger from "../assets/burger.svg";


// First row (Recommended)
  const recommendedItems = [
  {
    id: 1,
    cafeId: 1,
    name: "Neuro-Burger",
    image: burger,
    price: 45,
    description:
      "Plant-based patty with smart-sauce and crispy sweet potato fries.",
    tag: "vegetarian",
  },
  {
    id: 2,
    cafeId: 1,
    name: "Quantum Quinoa Bowl",
    image: quinoa,
    price: 38,
    description: "Fresh quinoa, avocado, kale, and a lemon-tahini dressing.",
    tag: "vegan",
  },
  {
    id: 3,
    cafeId: 3,
    name: "Sunset Smoothie",
    image: burger,
    price: 20,
    description: "Mango, pineapple, and strawberry blend with yogurt.",
    tag: "drink",
  },
];

// Campus Cafeterias
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
    description:
      "Rooftop dining with the best panoramic view of the campus skyline.",
    image:
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1600&q=60",
    popularItems: [
      { name: "Sunset Smoothie", price: 20 },
      { name: "High-Altitude Wrap", price: 40 },
    ],
  },
];


export default function StudentHome() {
  const student = JSON.parse(localStorage.getItem("student"));
  const firstName = student?.fullName?.split(" ")[0] || "Student";

  const navigate = useNavigate();

  return (
    <StudentLayout>

      <div className="w-screen relative left-1/2 -translate-x-1/2 px-6">

        {/* Welcome Section */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {firstName}
          </h1>
          

          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Your next meal is just a few taps away.
          </p>
        </section>


        {/* Recommended */}
        <section className="mb-14">

          <h2 className="mb-6 text-xl font-semibold text-white">
            ✨ Recommended for You
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {recommendedItems.map((item) => (
            <FoodCard
              key={item.id}
              image={item.image}
              title={item.name}
              description={item.description}
              price={`${item.price}`}
              badge={item.tag}
              buttonText="order now"
              variant="home"
              onClick={() => navigate(`/cafe/${item.cafeId}`)}
            />
          ))}

          </div>

        </section>


        {/* Cafeterias */}
        <section>

          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Campus Cafeterias
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {cafeterias.map((cafe) => (
              <CafeteriaCard key={cafe.id} cafe={cafe} />
            ))}

          </div>

        </section>

      </div>

    </StudentLayout>
  );
}
