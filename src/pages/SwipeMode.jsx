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

const EASE_OUT = [0.22, 1, 0.36, 1];

function SwipeCard({ recipe, x, rotate, likeOpacity, nopeOpacity, onDecision, draggable }) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const imageUrl = recipe.imageUrl || PLACEHOLDER_IMAGES[recipe.category] || PLACEHOLDER_IMAGES.Dinner;

  function handleDragEnd(_, info) {
    if (info.offset.x > 100) onDecision(1);
    else if (info.offset.x < -100) onDecision(-1);
    else animate(x, 0, { type: "spring", stiffness: 260, damping: 26 });
  }

  return (
    <motion.div
      className="absolute inset-0 swipe-card"
      style={{ x, rotate }}
      drag={draggable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.96, opacity: 0.6 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
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

  const categoriesParam = searchParams.get("categories");
  const singleCategory = searchParams.get("category");
  const categories = categoriesParam
    ? categoriesParam.split(",").map((c) => c.trim())
    : singleCategory
    ? [singleCategory]
    : ["Dinner"];
  const label = searchParams.get("label") || categories.join(" · ");
  const from = searchParams.get("from") || "/";

  const stateKey = `swipe_${categoriesParam || singleCategory || "Dinner"}`;

  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Single shared motion value drives drag, buttons AND arrow keys
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-22, 22]);
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -20], [1, 0]);

  useEffect(() => {
    getRecipesForCategories(categories).then((data) => {
      const byId = Object.fromEntries(data.map((r) => [r.id, r]));
      let order = null;
      let index = 0;
      try {
        const saved = JSON.parse(sessionStorage.getItem(stateKey) || "null");
        if (saved && Array.isArray(saved.order)) {
          const restored = saved.order.map((id) => byId[id]).filter(Boolean);
          if (restored.length === data.length && restored.length > 0) {
            order = restored;
            index = Math.min(saved.index || 0, restored.length);
          }
        }
      } catch { /* ignore */ }
      if (!order) {
        order = [...data].sort(() => Math.random() - 0.5);
        index = 0;
        sessionStorage.setItem(stateKey, JSON.stringify({ order: order.map((r) => r.id), index }));
      }
      setRecipes(order);
      setCurrentIndex(index);
      setLoading(false);
      if (data.length === 0 || index >= order.length) setFinished(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesParam, singleCategory]);

  function saveIndex(index) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(stateKey) || "null");
      if (saved) sessionStorage.setItem(stateKey, JSON.stringify({ ...saved, index }));
    } catch { /* ignore */ }
  }

  function decide(dir) {
    if (dir > 0) {
      saveIndex(currentIndex);
      navigate(`/recipe/${recipes[currentIndex].id}`);
    } else {
      const next = currentIndex + 1;
      saveIndex(next);
      if (next >= recipes.length) setFinished(true);
      else setCurrentIndex(next);
    }
  }

  // Programmatic fly-out used by drag-threshold, buttons and arrow keys
  function flyOut(dir) {
    if (animating || finished || loading || !recipes[currentIndex]) return;
    setAnimating(true);
    const target = dir * (typeof window !== "undefined" ? window.innerWidth : 600) * 1.1;
    animate(x, target, { duration: 0.32, ease: EASE_OUT }).then(() => {
      x.set(0);
      setAnimating(false);
      decide(dir);
    });
  }

  // Keyboard arrows (desktop)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); flyOut(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); flyOut(1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, finished, loading, animating, recipes]);

  function restartDeck() {
    const reshuffled = [...recipes].sort(() => Math.random() - 0.5);
    sessionStorage.setItem(stateKey, JSON.stringify({ order: reshuffled.map((r) => r.id), index: 0 }));
    setRecipes(reshuffled);
    setCurrentIndex(0);
    setFinished(false);
  }

  const current = recipes[currentIndex];
  const next = recipes[currentIndex + 1];

  return (
    <motion.div
      className="min-h-screen bg-[#1a1a1a] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    >
      <div className="flex items-center justify-between px-5 pt-14 pb-4 w-full max-w-md mx-auto">
        <button
          onClick={() => navigate(from)}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white font-black text-lg">{label}</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 px-5 relative w-full max-w-md mx-auto">
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
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              {recipes.length > 0 && (
                <button
                  onClick={restartDeck}
                  className="bg-[#3D5A3E] text-white font-bold px-6 py-3 rounded-2xl active:scale-[0.98] transition-transform"
                >
                  🔄 Browse again
                </button>
              )}
              <button
                onClick={() => navigate(from)}
                className="bg-white/10 text-white font-bold px-6 py-3 rounded-2xl active:scale-[0.98] transition-transform"
              >
                ← Back
              </button>
              {recipes.length === 0 && (
                <button
                  onClick={() => navigate("/library?add=true")}
                  className="bg-[#3D5A3E] text-white font-bold px-6 py-3 rounded-2xl"
                >
                  Add a Recipe
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-full" style={{ height: "calc(100vh - 220px)" }}>
            {next && (
              <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden"
                initial={{ scale: 0.92, opacity: 0.5 }}
                animate={{ scale: 0.95, opacity: 0.7 }}
                transition={{ duration: 0.25 }}
              >
                <img
                  src={next.imageUrl || PLACEHOLDER_IMAGES[next.category] || PLACEHOLDER_IMAGES.Dinner}
                  alt={next.title}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </motion.div>
            )}
            {current && (
              <SwipeCard
                key={currentIndex}
                recipe={current}
                x={x}
                rotate={rotate}
                likeOpacity={likeOpacity}
                nopeOpacity={nopeOpacity}
                draggable={!animating}
                onDecision={flyOut}
              />
            )}
          </div>
        )}
      </div>

      {!loading && !finished && current && (
        <div className="flex flex-col items-center gap-2 py-5">
          <div className="flex justify-center gap-8">
            <button
              onClick={() => flyOut(-1)}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <X size={28} className="text-[#ef4444]" />
            </button>
            <button
              onClick={() => flyOut(1)}
              className="w-16 h-16 bg-[#3D5A3E] rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <Check size={28} className="text-white" />
            </button>
          </div>
          {/* Desktop keyboard hint */}
          <p className="hidden lg:block text-white/40 text-xs font-medium mt-1">
            Use <span className="font-bold text-white/70">←</span> to skip ·{" "}
            <span className="font-bold text-white/70">→</span> to open recipe
          </p>
        </div>
      )}
    </motion.div>
  );
}
