import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { X, Check, ChevronLeft, Snowflake } from "lucide-react";
import { CREAMI_RECIPES, getCreamiType } from "@/data/creamiRecipes";
import CreamiRecipeModal from "@/components/CreamiRecipeModal";

function SwipeCard({ recipe, onSwipeLeft, onSwipeRight, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

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
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#FFF3E6] to-[#FFD9B0]">
        {/* Big emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8rem] drop-shadow-sm">{recipe.emoji}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

        {/* RECIPE stamp */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-16 left-6 border-4 border-[#4CAF50] rounded-xl px-4 py-2 rotate-[-15deg]"
        >
          <span className="text-[#4CAF50] text-2xl font-black tracking-wider">RECIPE!</span>
        </motion.div>

        {/* NOPE stamp */}
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-16 right-6 border-4 border-[#ef4444] rounded-xl px-4 py-2 rotate-[15deg]"
        >
          <span className="text-[#ef4444] text-2xl font-black tracking-wider">SKIP</span>
        </motion.div>

        {/* Freeze pill */}
        <div className="absolute top-6 left-6 frosted-pill shadow-sm">
          <Snowflake size={12} className="text-[#6BB5E8]" />
          <span className="text-xs font-bold text-[#4A8AB5]">24h freeze</span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {recipe.subtitle && (
            <span className="inline-block mb-2 text-[11px] font-bold text-white bg-[#6BB5E8] px-2.5 py-0.5 rounded-full">
              {recipe.subtitle}
            </span>
          )}
          <h2 className="text-white text-3xl font-black leading-tight mb-2">{recipe.title}</h2>
          <p className="text-white/75 text-sm line-clamp-2">{recipe.desc}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {recipe.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] font-bold text-white/90 bg-white/15 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CreamiSwipe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type") || "icecream";
  const label = searchParams.get("label") || "Creami";

  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [openRecipe, setOpenRecipe] = useState(null);

  useEffect(() => {
    const filtered = CREAMI_RECIPES.filter((r) => getCreamiType(r) === type);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setFinished(shuffled.length === 0);
  }, [type]);

  function advance() {
    const next = currentIndex + 1;
    if (next >= deck.length) setFinished(true);
    else setCurrentIndex(next);
  }

  function handleSwipeLeft() {
    advance();
  }

  function handleSwipeRight() {
    setOpenRecipe(deck[currentIndex]);
  }

  function restartDeck() {
    const reshuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(reshuffled);
    setCurrentIndex(0);
    setFinished(false);
  }

  const current = deck[currentIndex];
  const next = deck[currentIndex + 1];

  return (
    <div className="min-h-screen bg-[#12161c] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 w-full max-w-md mx-auto">
        <button
          onClick={() => navigate("/creami")}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white font-black text-lg flex items-center gap-2">
          <Snowflake size={16} className="text-[#6BB5E8]" /> {label}
        </h1>
        <div className="w-10" />
      </div>

      {/* Card stack */}
      <div className="flex-1 px-5 relative w-full max-w-md mx-auto">
        {finished || deck.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <div className="text-6xl mb-4">🍦</div>
            <h2 className="text-white text-2xl font-black mb-2">
              {deck.length === 0 ? "No recipes here yet" : "That's all!"}
            </h2>
            <p className="text-white/60 mb-6">
              {deck.length === 0
                ? `No ${label} recipes yet.`
                : `You've seen all ${label} recipes.`}
            </p>
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              {deck.length > 0 && (
                <button
                  onClick={restartDeck}
                  className="bg-[#6BB5E8] text-white font-bold px-6 py-3 rounded-2xl active:scale-[0.98] transition-transform"
                >
                  🔄 Browse again
                </button>
              )}
              <button
                onClick={() => navigate("/creami")}
                className="bg-white/10 text-white font-bold px-6 py-3 rounded-2xl active:scale-[0.98] transition-transform"
              >
                ← Back
              </button>
            </div>
          </div>
        ) : (
          <div className="relative h-full" style={{ height: "calc(100vh - 200px)" }}>
            {next && (
              <div className="absolute inset-0 scale-95 opacity-60 rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF3E6] to-[#FFD9B0] flex items-center justify-center">
                <span className="text-[8rem] opacity-70">{next.emoji}</span>
              </div>
            )}
            {current && (
              <SwipeCard
                key={current.id}
                recipe={current}
                isTop
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!finished && current && (
        <div className="flex justify-center gap-8 py-6">
          <button
            onClick={handleSwipeLeft}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <X size={28} className="text-[#ef4444]" />
          </button>
          <button
            onClick={handleSwipeRight}
            className="w-16 h-16 bg-[#6BB5E8] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Check size={28} className="text-white" />
          </button>
        </div>
      )}

      {/* Recipe detail modal */}
      <CreamiRecipeModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} />
    </div>
  );
}
