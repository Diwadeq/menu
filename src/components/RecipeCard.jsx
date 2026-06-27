import { Clock } from "lucide-react";
import DifficultyBars from "./DifficultyBars";

const PLACEHOLDER_IMAGES = {
  Breakfast: "https://images.unsplash.com/photo-1484723091739-30990106e5d7?w=600&q=80",
  Dinner: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  Sweets: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
  Snacks: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=600&q=80",
  Salads: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  Soups: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
  Smoothies: "https://images.unsplash.com/photo-1610970881699-44a5587cf761?w=600&q=80",
};

export default function RecipeCard({ recipe, onClick, className = "" }) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const imageUrl = recipe.imageUrl || PLACEHOLDER_IMAGES[recipe.category] || PLACEHOLDER_IMAGES.Dinner;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
      onClick={onClick}
    >
      {/* Photo section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGES.Dinner; }}
        />
        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* TOP LEFT: difficulty bars */}
        <div className="absolute top-3 left-3 frosted-pill">
          <DifficultyBars level={recipe.difficulty || 1} />
        </div>

        {/* TOP RIGHT: time */}
        <div className="absolute top-3 right-3 frosted-pill">
          <Clock size={11} className="text-[#3D5A3E]" />
          <span className="text-[11px] font-700 text-[#3D5A3E] font-bold">
            {totalTime > 0 ? `${totalTime} min` : "—"}
          </span>
        </div>
      </div>

      {/* Below photo */}
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <h3 className="font-bold text-[15px] text-[#2a2a2a] leading-tight truncate flex-1">
          {recipe.title}
        </h3>
        {recipe.calories ? (
          <span className="shrink-0 bg-[#C4622D] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            {recipe.calories} kcal
          </span>
        ) : null}
      </div>
    </div>
  );
}