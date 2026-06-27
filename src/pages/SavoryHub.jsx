import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const OPTIONS = [
  {
    emoji: "⚡",
    label: "Quick Made",
    desc: "Breakfast, snacks, fast lunch — under 20 min",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
    categories: "Breakfast,Snacks,Salads",
    color: "from-[#8B7355]/80",
    badge: "< 20 min",
  },
  {
    emoji: "🍽️",
    label: "Full Meal",
    desc: "Hearty dinners, soups, proper lunch — calorie-dense",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    categories: "Dinner,Soups",
    color: "from-[#3D5A3E]/80",
    badge: "Filling",
  },
];

export default function SavoryHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0"
        >
          <ChevronLeft size={20} className="text-[#2a2a2a]" />
        </button>
        <div>
          <p className="text-xs font-bold text-[#8a8070] uppercase tracking-widest">Savory</p>
          <h1 className="text-2xl font-black text-[#2a2a2a] leading-tight">How hungry are you?</h1>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-10">
        {OPTIONS.map((opt, i) => (
          <motion.div
            key={opt.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
            onClick={() => navigate(`/swipe?categories=${opt.categories}&label=${encodeURIComponent(opt.label)}`)}
            className="relative h-56 rounded-3xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
          >
            <img src={opt.image} alt={opt.label} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${opt.color} via-black/30 to-transparent`} />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="text-3xl mb-1">{opt.emoji}</div>
              <h2 className="text-white text-3xl font-black leading-tight">{opt.label}</h2>
              <p className="text-white/65 text-sm font-medium mt-1">{opt.desc}</p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-bold">{opt.badge}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
