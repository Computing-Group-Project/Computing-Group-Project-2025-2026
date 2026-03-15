import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import FoodCard from "../components/common/FoodCard.jsx";
import FoodModal from "../components/common/FoodModal.jsx";
import api from "../utils/api.js";
import { getFoodImage, getCafeteriaImage } from "../utils/foodImages.js";

export default function CafeMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedFood, setSelectedFood] = useState(null);
  const [cafe, setCafe] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const bannerRef = useRef(null);
  const dashboardTextRef = useRef(null);
  const cafeNameTextRef = useRef(null);
  const [textWidth, setTextWidth] = useState(null);

  const filters = ["All", ...categories.map(c => c.name)];

  // Measure text widths and animate pill size
  useEffect(() => {
    const target = showStickyHeader ? cafeNameTextRef.current : dashboardTextRef.current;
    if (target) {
      setTextWidth(target.scrollWidth);
    }
  }, [showStickyHeader, cafe]);

  // Show sticky header when banner scrolls out of view
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(banner);
    return () => observer.disconnect();
  }, [cafe]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cafeRes, menuRes, catRes] = await Promise.all([
          api.get(`/api/cafeterias/${id}`),
          api.get(`/api/menus/cafeteria/${id}`),
          api.get("/api/categories"),
        ]);

        const cafeData = cafeRes.data.data;
        setCafe({
          name: cafeData.name,
          description: cafeData.description || "",
          banner: getCafeteriaImage(cafeData.cafeteriaId || parseInt(id)),
        });

        const menuItems = menuRes.data.data || [];
        setFoods(menuItems.map(item => ({
          id: item.menuId,
          menuItemId: item.menuId,
          title: item.name,
          description: item.description || "",
          price: item.basePrice,
          image: getFoodImage(item.name, item.imageUrl),
          category: item.category ? [item.category.name] : [],
          cafeteriaId: item.cafeteriaId,
          extras: (item.customizations || [])
            .filter(c => c.available)
            .map(c => ({
              name: c.ingredientName,
              price: c.priceAdjustment || 0,
            })),
        })));

        setCategories(catRes.data.data || []);
      } catch {
        setCafe(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-10 w-10 border-4 border-teal-400 border-t-transparent rounded-full"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!cafe) {
    return (
      <StudentLayout>
        <div className="text-gray-900 dark:text-white p-10 text-center">
          Cafe not found
        </div>
      </StudentLayout>
    );
  }

  const filteredFoods = foods.filter((food) => {
    const searchMatch = food.title.toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter === "All" || food.category.includes(filter);
    return searchMatch && filterMatch;
  });

  return (
    <StudentLayout>
      {/* Floating pill — morphs between "Back to Dashboard" and cafe name */}
      {createPortal(
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 h-[70px] flex items-center">
          <div
            onClick={() => {
              if (showStickyHeader) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-lg shadow-black/10 cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            <button
              onClick={(e) => { if (showStickyHeader) { e.stopPropagation(); navigate("/"); } }}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors duration-300 text-lg"
            >
              &larr;
            </button>
            <span
              className="relative overflow-hidden h-[1.5em]"
              style={{ width: textWidth ? `${textWidth}px` : "auto", transition: "width 500ms ease-in-out" }}
            >
              <span
                ref={dashboardTextRef}
                className={`absolute left-0 text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap transition-all duration-500 ease-in-out ${
                  showStickyHeader
                    ? "opacity-0 -translate-y-full"
                    : "opacity-100 translate-y-0"
                }`}
              >
                Back to Dashboard
              </span>
              <span
                ref={cafeNameTextRef}
                className={`absolute left-0 text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap transition-all duration-500 ease-in-out ${
                  showStickyHeader
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-full"
                }`}
              >
                {cafe.name}
              </span>
            </span>
          </div>
        </div>,
        document.body
      )}

      <div className="w-screen relative left-1/2 -translate-x-1/2 px-6">

        {/* Banner */}
        <div ref={bannerRef} className="relative w-full h-[180px] sm:h-[260px] rounded-2xl overflow-hidden mb-8">
          <img src={cafe.banner} alt={cafe.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">{cafe.name}</h1>
            <p className="mt-3 text-gray-200 max-w-2xl">{cafe.description}</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <SearchBar placeholder="Search menu..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${filter === item
                  ? "bg-teal-400 text-black"
                  : "border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
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
