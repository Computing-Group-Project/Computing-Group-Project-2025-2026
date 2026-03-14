import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import FoodCard from "../components/common/FoodCard.jsx";
import FoodModal from "../components/common/FoodModal.jsx";
import api from "../utils/api.js";
import burger from "../assets/burger.svg";

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

  const filters = ["All", ...categories.map(c => c.name)];

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
          banner: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=60",
        });

        const menuItems = menuRes.data.data || [];
        setFoods(menuItems.map(item => ({
          id: item.menuId,
          menuItemId: item.menuId,
          title: item.name,
          description: item.description || "",
          price: item.basePrice,
          image: item.imageUrl || burger,
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
      <div className="w-screen relative left-1/2 -translate-x-1/2 px-6">

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
          text-sm font-medium text-gray-700 dark:text-white
          bg-white/60 dark:bg-slate-800/60 backdrop-blur
          border border-gray-200 dark:border-slate-700
          hover:bg-gray-100 dark:hover:bg-slate-700
          hover:shadow-md hover:shadow-slate-900/40
          active:scale-95
          transition-all duration-200 mb-6"
        >
          <span className="text-base">&lt;</span>
          Back to Dashboard
        </button>

        {/* Banner */}
        <div className="relative w-full h-[180px] sm:h-[260px] rounded-2xl overflow-hidden mb-8">
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
