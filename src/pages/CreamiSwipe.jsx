import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { X, Check, ChevronLeft, Snowflake } from "lucide-react";
import { CREAMI_RECIPES, getCreamiType } from "@/data/creamiRecipes";
import CreamiRecipeModal from "@/components/CreamiRecipeModal";

const EASE_OUT = [0.22, 1, 0.36, 1];

function SwipeCard({ recipe, x, rotate, likeOpacity, nopeOpacity, onDecision, draggable }) {
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
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#FFF3E6] to-[#FFD9B0]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8rem] drop-shadow-sm">{recipe.emoji}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-16 left-6 border-4 border-[#4CAF50] rounded-xl px-4 py-2 rotate-[-15deg]"
        >
          <span className="text-[#4CAF50] text-2xl font-black tracking-wider">RECIPE!</span>
        </motion.div>

        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-16 right-6 border-4 border-[#ef4444] rounded-xl px-4 py-2 rotate-[15deg]"
        >
          <span className="text-[#ef4444] text-2xl font-black tracking-wider">SKIP</span>
        </motion.div>

        <div className="absolute top-6 left-6 frosted-pill shadow-sm">
          <Snowflake size={12} className="text-[#6BB5E8]" />
          <span className="text-xs font-bold text-[#4A8AB5]">24h freeze</span>
        </div>

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
  const [animating, setAnimating] = useState(false);
  const [openRecipe, setOpenRecipe] = useState(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-22, 22]);
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -20], [1, 0]);

  useEffect(() => {
    const filtered = CREAMI_RECIPES.filter((r) => getCreamiType(r) === type);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setFinished(shuffled.length === 0);
  }, [type]);

  function advance() {
    const nextI = currentIndex + 1;
    if (nextI >= deck.length) setFinished(true);
    else setCurrentIndex(nextI);
  }

  // dir: -1 skip (fly out + advance), +1 open recipe (snap back + modal)
  function trigger(dir) {
    if (animating || finished || !deck[currentIndex]) return;
    if (dir > 0) {
      animate(x, 0, { type: "spring", stiffness: 260, damping: 26 });
      setOpenRecipe(deck[currentIndex]);
    } else {
      setAnimating(true);
      const target = -(typeof window !== "undefined" ? window.innerWidth : 600) * 1.1;
      animate(x, target, { duration: 0.32, ease: EASE_OUT }).then(() => {
        x.set(0);
        setAnimating(false);
        advance();
      });
    }
  }

  // Keyboard arrows (desktop)
  useEffect(() => {
    function onKey(e) {
      if (openRecipe) return; // let modal handle its own keys
      if (e.key === "ArrowLeft") { e.preventDefault(); trigger(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); trigger(1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, finished, animating, openRecipe, deck]);

  function restartDeck() {
    const reshuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(reshuffled);
    setCurrentIndex(0);
    setFinished(false);
  }

  const current = deck[currentIndex];
  const next = deck[currentIndex + 1];

  return (
    <motion.div
      className="min-h-screen bg-[#12161c] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    >
      <div className="flex items-center justify-between px-5 pt-14 pb-4 w-full max-w-md mx-auto">
        <button
          onClick={() => navigate("/creami")}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white font-black text-lg flex items-center gap-2">
          <Snowflake size={16} className="text-[#6BB5E8]" /> {label}
        </h1>
        <div className="w-10" />
      </div>

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
          <div className="relative h-full" style={{ height: "calc(100vh - 220px)" }}>
            {next && (
              <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF3E6] to-[#FFD9B0] flex items-center justify-center"
                initial={{ scale: 0.92, opacity: 0.4 }}
                animate={{ scale: 0.95, opacity: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                <span className="text-[8rem] opacity-70">{next.emoji}</span>
              </motion.div>
            )}
            {current && (
              <SwipeCard
                key={current.id}
                recipe={current}
                x={x}
                rotate={rotate}
                likeOpacity={likeOpacity}
                nopeOpacity={nopeOpacity}
                draggable={!animating}
                onDecision={trigger}
              />
            )}
          </div>
        )}
      </div>

      {!finished && current && (
        <div className="flex flex-col items-center gap-2 py-5">
          <div className="flex justify-center gap-8">
            <button
              onClick={() => trigger(-1)}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <X size={28} className="text-[#ef4444]" />
            </button>
            <button
              onClick={() => trigger(1)}
              className="w-16 h-16 bg-[#6BB5E8] rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <Check size={28} className="text-white" />
            </button>
          </div>
          <p className="hidden lg:block text-white/40 text-xs font-medium mt-1">
            Use <span className="font-bold text-white/70">←</span> to skip ·{" "}
            <span className="font-bold text-white/70">→</span> to open recipe
          </p>
        </div>
      )}

      <CreamiRecipeModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} />
    </motion.div>
  );
}
