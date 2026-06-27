import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, Users, Flame, Dumbbell, Wheat, Droplets, Edit, Trash2, CheckCircle } from "lucide-react";
import DifficultyBars from "@/components/DifficultyBars";
import { db } from "@/lib/store";

const PLACEHOLDER_IMAGES = {
  Breakfast: "https://images.unsplash.com/photo-1484723091739-30990106e5d7?w=800&q=80",
  Dinner: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  Sweets: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
  Snacks: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=800&q=80",
  Salads: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  Soups: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  Smoothies: "https://images.unsplash.com/photo-1610970881699-44a5587cf761?w=800&q=80",
};

const DIFFICULTY_LABELS = { 1: "Easy", 2: "Medium", 3: "Hard" };

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markedCooked, setMarkedCooked] = useState(false);

  useEffect(() => {
    db.entities.Recipe.get(id).then((data) => {
      setRecipe(data);
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    if (!confirm("Delete this recipe?")) return;
    await db.entities.Recipe.delete(id);
    navigate("/library");
  }

  async function handleMarkCooked() {
    await db.entities.CookingHistory.create({
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      cookedDate: new Date().toISOString().split("T")[0],
    });
    setMarkedCooked(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#A8C5A0] border-t-[#3D5A3E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center">
        <p className="text-gray-500">Recipe not found.</p>
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const imageUrl = recipe.imageUrl || PLACEHOLDER_IMAGES[recipe.category] || PLACEHOLDER_IMAGES.Dinner;

  return (
    <div className="min-h-screen bg-[#FAF6EF] lg:max-w-2xl lg:mx-auto lg:shadow-xl">
      {/* Hero photo */}
      <div className="relative h-72 lg:h-80 overflow-hidden rounded-b-[2.5rem]">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGES.Dinner; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-b-[2.5rem]" />

        <div className="absolute top-12 left-5 right-5 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow"
          >
            <ChevronLeft size={20} className="text-[#2a2a2a]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/recipe/${id}/edit`)}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow"
            >
              <Edit size={16} className="text-[#3D5A3E]" />
            </button>
            <button
              onClick={handleDelete}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow"
            >
              <Trash2 size={16} className="text-[#ef4444]" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-5 left-5">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {recipe.category}
          </span>
        </div>
      </div>

      <div className="px-5 -mt-2">
        <div className="flex items-start justify-between gap-3 mt-5 mb-4">
          <h1 className="text-3xl font-black text-[#2a2a2a] leading-tight flex-1">{recipe.title}</h1>
          {recipe.calories && (
            <span className="shrink-0 bg-[#C4622D] text-white text-sm font-bold px-3 py-1.5 rounded-full mt-1">
              {recipe.calories} kcal
            </span>
          )}
        </div>

        {/* Info row */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-around mb-5">
          <div className="flex flex-col items-center gap-1">
            <DifficultyBars level={recipe.difficulty || 1} size="lg" />
            <span className="text-xs text-[#8a8070] font-semibold">{DIFFICULTY_LABELS[recipe.difficulty] || "Easy"}</span>
          </div>
          <div className="w-px h-8 bg-[#e8e0d5]" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-[#3D5A3E]">
              <Clock size={14} />
              <span className="text-sm font-bold">{recipe.prepTime || 0} min</span>
            </div>
            <span className="text-xs text-[#8a8070] font-semibold">Prep</span>
          </div>
          <div className="w-px h-8 bg-[#e8e0d5]" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-[#C4622D]">
              <Flame size={14} />
              <span className="text-sm font-bold">{recipe.cookTime || 0} min</span>
            </div>
            <span className="text-xs text-[#8a8070] font-semibold">Cook</span>
          </div>
          <div className="w-px h-8 bg-[#e8e0d5]" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-[#8a8070]">
              <Users size={14} />
              <span className="text-sm font-bold">{recipe.servings || 1}</span>
            </div>
            <span className="text-xs text-[#8a8070] font-semibold">Servings</span>
          </div>
        </div>

        {/* Nutrition */}
        {(recipe.calories || recipe.protein || recipe.carbs || recipe.fat) && (
          <div className="bg-[#3D5A3E] rounded-2xl p-4 mb-5">
            <h3 className="text-[#A8C5A0] text-xs font-bold uppercase tracking-widest mb-3">Nutrition per serving</h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Calories", val: recipe.calories, unit: "kcal", icon: Flame },
                { label: "Protein", val: recipe.protein, unit: "g", icon: Dumbbell },
                { label: "Carbs", val: recipe.carbs, unit: "g", icon: Wheat },
                { label: "Fat", val: recipe.fat, unit: "g", icon: Droplets },
              ].map(({ label, val, unit, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center">
                  <Icon size={14} className="text-[#A8C5A0] mb-1" />
                  <span className="text-white font-black text-lg leading-none">{val ?? "—"}</span>
                  <span className="text-[#A8C5A0] text-[10px] font-semibold">{unit}</span>
                  <span className="text-[#A8C5A0] text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recipe.description && (
          <p className="text-[#6a6050] text-sm mb-5 leading-relaxed">{recipe.description}</p>
        )}

        {recipe.ingredients?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#2a2a2a] mb-3">Ingredients</h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-[#f0ece6]">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#2a2a2a] font-semibold text-sm">{ing.name}</span>
                  <span className="text-[#C4622D] font-bold text-sm">
                    {ing.quantity} {ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recipe.steps?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#2a2a2a] mb-3">Instructions</h2>
            <div className="flex flex-col gap-4">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-[#3D5A3E] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-sm font-black">{i + 1}</span>
                  </div>
                  <p className="text-[#2a2a2a] text-sm leading-relaxed flex-1 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pb-10">
          <button
            onClick={handleMarkCooked}
            disabled={markedCooked}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
              markedCooked ? "bg-[#A8C5A0] text-white" : "bg-[#3D5A3E] text-white active:scale-[0.98]"
            }`}
          >
            {markedCooked ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle size={20} /> Cooked! 🎉
              </span>
            ) : (
              "Mark as Cooked"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
