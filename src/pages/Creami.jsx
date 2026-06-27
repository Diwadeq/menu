import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Snowflake } from "lucide-react";
import { CREAMI_TYPES, CREAMI_RECIPES, getCreamiType } from "@/data/creamiRecipes";

export default function Creami() {
  const navigate = useNavigate();

  const countFor = (key) => CREAMI_RECIPES.filter((r) => getCreamiType(r) === key).length;

  return (
    <div className="min-h-screen bg-[#FAF6EF] lg:max-w-3xl lg:mx-auto">
      {/* Header */}
      <div className="px-5 pt-14 lg:pt-10 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0"
        >
          <ChevronLeft size={20} className="text-[#2a2a2a]" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Snowflake size={14} className="text-[#6BB5E8]" />
            <span className="text-xs font-bold text-[#6BB5E8] tracking-widest uppercase">Creami Lab</span>
          </div>
          <h1 className="text-2xl font-black text-[#2a2a2a] leading-tight">What are you making?</h1>
        </div>
      </div>

      {/* Freeze reminder */}
      <div className="px-5 mb-3">
        <div className="bg-[#EEF6FB] border border-[#B8DDF5] rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <Snowflake size={14} className="text-[#6BB5E8] shrink-0" />
          <p className="text-xs text-[#4A8AB5] font-semibold">
            Every base needs 24h freeze. Prep <strong>tonight</strong>, spin tomorrow.
          </p>
        </div>
      </div>

      {/* Type tiles */}
      <div className="px-5 grid grid-cols-1 sm:grid-cols-3 gap-4 pb-10">
        {CREAMI_TYPES.map((t, i) => (
          <motion.div
            key={t.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            onClick={() => navigate(`/creami/swipe?type=${t.key}&label=${encodeURIComponent(t.label)}`)}
            className="relative h-44 rounded-3xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
          >
            <img src={t.image} alt={t.label} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${t.color} via-black/30 to-transparent`} />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="text-3xl mb-1">{t.emoji}</div>
              <h2 className="text-white text-2xl font-black leading-tight">{t.label}</h2>
              <p className="text-white/65 text-xs font-medium mt-1">{t.desc}</p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-bold">{countFor(t.key)} · Swipe ›</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
