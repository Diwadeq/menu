import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const OPTIONS = [
  {
    emoji: "🔥",
    label: "Hot & Baked",
    desc: "Warm desserts, baked oats, chocolate treats",
    image: "https://images.unsplash.com/photo-1484723091739-30990106e5d7?w=800&q=80",
    categories: "Sweets,Breakfast",
    color: "from-[#5c1a1a]/70",
  },
  {
    emoji: "🥣",
    label: "Quick & No-Cook",
    desc: "Greek yogurt bowls, fruit, no heating or freezing",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    categories: "Snacks,Smoothies",
    color: "from-[#3D5A3E]/70",
  },
];

export default function SweetHub() {
  const navigate = useNavigate();

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
          <p className="text-xs font-bold text-[#8a8070] uppercase tracking-widest">Sweet</p>
          <h1 className="text-2xl font-black text-[#2a2a2a] leading-tight">What kind of sweet?</h1>
        </div>
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
        {OPTIONS.map((opt, i) => (
          <motion.div
            key={opt.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            onClick={() => navigate(`/swipe?categories=${opt.categories}&label=${encodeURIComponent(opt.label)}&from=/sweet`)}
            className="relative h-44 rounded-3xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
          >
            <img src={opt.image} alt={opt.label} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${opt.color} via-black/25 to-transparent`} />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="text-2xl mb-1">{opt.emoji}</div>
              <h2 className="text-white text-2xl font-black leading-tight">{opt.label}</h2>
              <p className="text-white/65 text-xs font-medium mt-1">{opt.desc}</p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-bold">Swipe ›</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
