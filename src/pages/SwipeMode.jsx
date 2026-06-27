import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Clock, X, Check, ChevronLeft } from "lucide-react";
import DifficultyBars from "@/components/DifficultyBars";
import { db } from "@/lib/store";

async function getRecipesForCategories(categories) {
  const all = await db.entities.Recipe.list();
  return all.filter((r) => categories.includes(r.category));
}

const PLACEHOLDER_IMAGES = {
  Breakfast: "https://images.unsplash.com/photo-1484723091739-30990106e5d7?w=800&q=80",
  Dinner: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  Sweets: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
  Snacks: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=800&q=80",
  Salads: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  Soups: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  Smoothies: "https://images.unsplash.com/photo-1610970881699-44a5587cf761?w=800&q=80",
};

function SwipeCard({ recipe, onSwipeLeft, onSwipeRight, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const imageUrl = recipe.imageUrl || PLACEHOLDER_IMAGES[recipe.category] || PLACEHOLDER_IMAGES.Dinner;

  function handleDragEnd(_, info) {
    if (info.offset.x > 100) {
      animate(x, 600, { duration: 0.3 }).then(onSwipeRight);
    } else if (info.offset.x < -100) {
      animate(x, -600, { duration: 0.3 }).then(onSwipeLeft);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  }

  return (
    <motion.div
      className="absolute inset-0 swipe-card"
      style={{ x, rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGES.Dinner; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-16 left-6 border-4 border-[#4CAF50] rounded-xl px-4 py-2 rotate-[-15deg]"
        >
          <span className="text-[#4CAF50] text-2xl font-black tracking-wider">COOK IT!</span>
        </motion.div>

        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-16 right-6 border-4 border-[#ef4444] rounded-xl px-4 py-2 rotate-[15deg]"
        >
          <span className="text-[#ef4444] text-2xl font-black tracking-wider">SKIP</span>
        </motion.div>

        <div className="absolute top-6 left-6 frosted-pill shadow-sm">
          <DifficultyBars level={recipe.difficulty || 1} />
        </div>

        <div className="absolute top-6 right-6 frosted-pill shadow-sm">
          <Clock size={12} className="text-[#3D5A3E]" />
          <span className="text-xs font-bold text-[#3D5A3E]">
            {totalTime > 0 ? `${totalTime} min` : "—"}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1 block">
            {recipe.category}
          </span>
          <h2 className="text-white text-3xl font-black leading-tight mb-2">{recipe.title}</h2>
          <div className="flex items-center gap-3">
            {recipe.calories && (
              <span className="bg-[#C4622D] text-white text-xs font-bold px-3 py-1 rounded-full">
                {recipe.calories} kcal
              </span>
            )}
            {recipe.description && (
              <p className="text-white/70 text-sm line-clamp-1 flex-1">{recipe.description}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SwipeMode() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Support both `categories=A,B,C` (multi) and legacy `category=X` (single)
  const categoriesParam = searchParams.get("categories");
  const singleCategory = searchParams.get("category");
  const categories = categoriesParam
    ? categoriesParam.split(",").map((c) => c.trim())
    : singleCategory
    ? [singleCategory]
    : ["Dinner"];
  const label = searchParams.get("label") || categories.join(" · ");

  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getRecipesForCategories(categories).then((data) => {
      // Shuffle for variety
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setRecipes(shuffled);
      setLoading(false);
      if (data.length === 0) setFinished(true);
    });
  }, [categoriesParam, singleCategory]);

  function handleSwipeLeft() {
    const next = currentIndex + 1;
    if (next >= recipes.length) setFinished(true);
    else setCurrentIndex(next);
  }

  function handleSwipeRight() {
    navigate(`/recipe/${recipes[currentIndex].id}`);
  }

  const current = recipes[currentIndex];
  const next = recipes[currentIndex + 1];

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white font-black text-lg">{label}</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 px-5 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : finished || recipes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <div className="text-6xl mb-4">🌿</div>
            <h2 className="text-white text-2xl font-black mb-2">
              {recipes.length === 0 ? "No recipes yet!" : "That's all!"}
            </h2>
            <p className="text-white/60 mb-6">
              {recipes.length === 0
                ? `No ${label} recipes yet. Add some to your library!`
                : `You've seen all ${label} recipes.`}
            </p>
            <button
              onClick={() => navigate("/library?add=true")}
              className="bg-[#3D5A3E] text-white font-bold px-6 py-3 rounded-2xl"
            >
              Add a Recipe
            </button>
          </div>
        ) : (
          <div className="relative h-full" style={{ height: "calc(100vh - 200px)" }}>
            {next && (
              <div className="absolute inset-0 scale-95 opacity-70 rounded-3xl overflow-hidden">
                <img
                  src={next.imageUrl || PLACEHOLDER_IMAGES[next.category] || PLACEHOLDER_IMAGES.Dinner}
                  alt={next.title}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            )}
            {current && (
              <SwipeCard
                key={currentIndex}
                recipe={current}
                isTop
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            )}
          </div>
        )}
      </div>

      {!loading && !finished && current && (
        <div className="flex justify-center gap-8 py-6">
          <button
            onClick={handleSwipeLeft}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <X size={28} className="text-[#ef4444]" />
          </button>
          <button
            onClick={handleSwipeRight}
            className="w-16 h-16 bg-[#3D5A3E] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Check size={28} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
