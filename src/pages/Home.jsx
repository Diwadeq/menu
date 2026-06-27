import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Snowflake } from "lucide-react";

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
          What are you<br />
          <span className="text-[#3D5A3E]">feeling today?</span>
        </h1>
        <p className="text-[#8a8070] mt-2 text-sm font-medium">Pick a vibe and we'll find your meal</p>
      </div>

      <div className="px-6 flex flex-col gap-4 pb-4">
        {/* Sweet */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45, ease: "easeOut" }}
          onClick={() => navigate("/sweet")}
          className="relative h-52 rounded-3xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80"
            alt="Sweet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="text-3xl mb-1">🍓</div>
            <h2 className="text-white text-4xl font-black leading-none">Sweet</h2>
            <p className="text-white/70 text-sm font-medium mt-1">Iced · Hot · Quick no-cook</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-xs font-bold">Explore ›</span>
          </div>
        </motion.div>

        {/* Savory */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
          onClick={() => navigate("/savory")}
          className="relative h-52 rounded-3xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
            alt="Savory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="text-3xl mb-1">🥗</div>
            <h2 className="text-white text-4xl font-black leading-none">Savory</h2>
            <p className="text-white/70 text-sm font-medium mt-1">Quick made · Full meal</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-xs font-bold">Explore ›</span>
          </div>
        </motion.div>

        {/* Creami CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          onClick={() => navigate("/creami")}
          className="relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-r from-[#1a3a5c] to-[#2a6090] active:scale-[0.98] transition-transform shadow-lg"
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Snowflake size={13} className="text-[#6BB5E8]" />
                <span className="text-xs font-bold text-[#6BB5E8] tracking-widest uppercase">Tonight's prep</span>
              </div>
              <h2 className="text-white text-xl font-black leading-tight">🍦 Creami Lab</h2>
              <p className="text-white/55 text-xs mt-0.5">Freeze tonight · enjoy tomorrow</p>
            </div>
            <span className="text-4xl">🍦</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
