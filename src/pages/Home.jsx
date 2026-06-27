import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Snowflake } from "lucide-react";

const MAIN_CATEGORIES = [
  {
    name: "Dinner",
    emoji: "🍽️",
    description: "Nourishing evening meals",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    color: "#3D5A3E",
    path: "/swipe?category=Dinner",
  },
  {
    name: "Breakfast",
    emoji: "🌅",
    description: "Start your day right",
    image: "https://images.unsplash.com/photo-1484723091739-30990106e5d7?w=800&q=80",
    color: "#8B7355",
    path: "/swipe?category=Breakfast",
  },
  {
    name: "Sweets",
    emoji: "🍓",
    description: "Healthy desserts & treats",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    color: "#C4622D",
    path: "/swipe?category=Sweets",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={20} className="text-[#A8C5A0]" />
          <span className="text-sm font-bold text-[#A8C5A0] tracking-widest uppercase">HealthyBite</span>
        </div>
        <h1 className="text-4xl font-black text-[#2a2a2a] leading-tight">
          What shall we<br />
          <span className="text-[#3D5A3E]">cook today?</span>
        </h1>
        <p className="text-[#8a8070] mt-2 text-sm font-medium">
          Swipe through recipes your whole family loves
        </p>
      </div>

      {/* Main category tiles */}
      <div className="px-6 flex flex-col gap-4 pb-4">
        {MAIN_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.45, ease: "easeOut" }}
            onClick={() => navigate(cat.path)}
            className="relative h-44 rounded-3xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <h2 className="text-white text-3xl font-black leading-none">{cat.name}</h2>
              <p className="text-white/70 text-sm font-medium mt-1">{cat.description}</p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-bold">Swipe ›</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* More categories */}
      <div className="px-6 pt-2 pb-4">
        <p className="text-xs font-bold text-[#8a8070] uppercase tracking-widest mb-3">More categories</p>
        <div className="flex flex-wrap gap-2">
          {["Salads", "Soups", "Snacks", "Smoothies"].map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/swipe?category=${cat}`)}
              className="bg-white border border-[#e8e0d5] text-[#3D5A3E] font-bold text-sm px-4 py-2 rounded-full shadow-sm hover:bg-[#3D5A3E] hover:text-white transition-all"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Creami CTA */}
      <div className="px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          onClick={() => navigate("/creami")}
          className="relative rounded-3xl overflow-hidden cursor-pointer shadow-lg bg-gradient-to-r from-[#1a3a5c] to-[#2a6090] active:scale-[0.98] transition-transform"
        >
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Snowflake size={14} className="text-[#6BB5E8]" />
                <span className="text-xs font-bold text-[#6BB5E8] tracking-widest uppercase">Tonight's Prep</span>
              </div>
              <h2 className="text-white text-2xl font-black leading-tight">🍦 Creami Lab</h2>
              <p className="text-white/60 text-sm mt-1">Make tonight, enjoy tomorrow</p>
            </div>
            <div className="text-5xl">🍦</div>
          </div>
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-xs font-bold">18 recipes ›</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
