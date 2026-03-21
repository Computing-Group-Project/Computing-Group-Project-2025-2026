import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FoodCard from "../components/common/FoodCard.jsx";
import FoodModal from "../components/common/FoodModal.jsx";
import CafeteriaCard from "../components/common/CafeteriaCard.jsx";
import StudentLayout from "../layouts/StudentLayout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import api from "../utils/api.js";
import { getFoodImage, getCafeteriaImage } from "../utils/foodImages.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

// Fallback recommended items (used when API not available)
const fallbackRecommended = [
  {
    id: 1, cafeId: 1, name: "Neuro-Burger", image: getFoodImage("Neuro-Burger"), price: 45,
    description: "Plant-based patty with smart-sauce and crispy sweet potato fries.", tag: "vegetarian",
  },
  {
    id: 2, cafeId: 1, name: "Quantum Quinoa Bowl", image: getFoodImage("Quantum Quinoa Bowl"), price: 38,
    description: "Fresh quinoa, avocado, kale, and a lemon-tahini dressing.", tag: "vegan",
  },
  {
    id: 3, cafeId: 3, name: "Sunset Smoothie", image: getFoodImage("Sunset Smoothie"), price: 20,
    description: "Mango, pineapple, and strawberry blend with yogurt.", tag: "drink",
  },
];

export default function StudentHome() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const rawName = user?.username?.split("_")[0] || "Student";
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const [cafeterias, setCafeterias] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState(fallbackRecommended);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Enforce 3-per-session limit
      const cached = sessionStorage.getItem('recs_shown');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.length > 0) {
            setRecommendedItems(parsed);
            return;
          }
        } catch { /* fall through to fetch */ }
      }

      try {
        const res = await api.get('/api/recommendations?context=homepage&limit=3');
        const recs = res.data?.data?.recommendations || [];
        if (recs.length > 0) {
          const items = await Promise.all(recs.map(async (rec) => {
            const itemId = rec.item_id ?? rec.itemId;
            if (!itemId) return null;
            try {
              const menuRes = await api.get(`/api/menus/${itemId}`);
              const item = menuRes.data?.data;
              if (item) {
                return {
                  id: item.menuId,
                  cafeId: item.cafeteriaId,
                  name: item.name,
                  image: getFoodImage(item.name, item.imageUrl),
                  price: item.basePrice,
                  description: item.description || '',
                  tag: (rec.recommendation_type ?? rec.recommendationType ?? 'recommended').toLowerCase(),
                };
              }
            } catch { /* skip failed items */ }
            return null;
          }));
          const validItems = items.filter(Boolean);
          if (validItems.length > 0) {
            setRecommendedItems(validItems);
            sessionStorage.setItem('recs_shown', JSON.stringify(validItems));
          }
        }
      } catch {
        // Keep fallback
      }
    };
    if (user) fetchRecommendations();
  }, [user]);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const res = await api.get("/api/cafeterias");
        const data = res.data.data || [];
        setCafeterias(data.map(c => ({
          id: c.cafeteriaId,
          name: c.name,
          hours: c.operatingHours || "N/A",
          status: c.isActive ? "Open" : "Closed",
          rating: parseFloat(c.averageRating) || 0,
          description: c.description || "",
          image: getCafeteriaImage(c.cafeteriaId),
          popularItems: [],
        })));
      } catch {
        setFetchError(true);
        // Fallback if API unavailable
        setCafeterias([
          { id: 1, name: "The Last Drop", hours: "08:00 – 22:00", status: "Open", rating: 4, description: "Cozy atmosphere for study sessions.", image: getCafeteriaImage(1), popularItems: [] },
          { id: 2, name: "Hex Core Cafe", hours: "07:00 – 20:00", status: "Open", rating: 4, description: "Industrial chic meets molecular gastronomy.", image: getCafeteriaImage(2), popularItems: [] },
          { id: 3, name: "Skyline Sips", hours: "10:00 – 18:00", status: "Open", rating: 4, description: "Rooftop dining with panoramic view.", image: getCafeteriaImage(3), popularItems: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCafeterias();
  }, []);

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
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recommendedItems.map((item) => {
              const cafeName = cafeterias.find(c => c.id === item.cafeId)?.name || "";
              return (
                <FoodCard
                  key={item.id}
                  image={item.image}
                  title={item.name}
                  subtitle={cafeName}
                  description={item.description}
                  price={`${item.price}`}
                  badge={item.tag}
                  buttonText="Add to Cart"
                  variant="home"
                  onClick={() => {
                    addToCart({
                      menuItemId: item.id,
                      cafeteriaId: item.cafeId,
                      title: item.name,
                      image: item.image,
                      price: item.price,
                      total: item.price,
                      extras: [],
                      qty: 1,
                    });
                    showToast(`${item.name} added to cart!`, "success");
                  }}
                />
              );
            })}
          </div>
        </section>

        {/* Cafeterias */}
        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Campus Cafeterias
          </h2>
          {fetchError && (
            <p className="text-sm text-yellow-500 mb-2">Using cached data - couldn't reach server</p>
          )}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cafeterias.map((cafe) => (
                <CafeteriaCard key={cafe.id} cafe={cafe} />
              ))}
            </div>
          )}
        </section>

      </div>

      {selectedFood && createPortal(
        <FoodModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />,
        document.body
      )}
    </StudentLayout>
  );
}
