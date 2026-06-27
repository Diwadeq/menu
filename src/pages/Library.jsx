import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, X, SlidersHorizontal, Upload, Download } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { db, importJSON, exportData } from "@/lib/store";

const CATEGORIES = ["All", "Breakfast", "Dinner", "Sweets", "Snacks", "Salads", "Soups", "Smoothies"];
const DIFFICULTIES = [{ label: "Any", value: null }, { label: "Easy", value: 1 }, { label: "Medium", value: 2 }, { label: "Hard", value: 3 }];

export default function Library() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (searchParams.get("add") === "true") navigate("/recipe/new");
  }, [searchParams]);

  useEffect(() => {
    db.entities.Recipe.list("-created_date").then((data) => {
      setRecipes(data);
      setLoading(false);
    });
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = await importJSON(text);
      const fresh = await db.entities.Recipe.list("-created_date");
      setRecipes(fresh);
      showToast(`Imported ${result.recipes} recipe${result.recipes !== 1 ? 's' : ''}${result.plan ? ' + meal plan' : ''}`);
    } catch {
      showToast("Import failed — check JSON format");
    }
    e.target.value = "";
  }

  function handleExport() {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthybite-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = recipes.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    const matchDiff = activeDifficulty === null || r.difficulty === activeDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a2a] text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#FAF6EF] sticky top-0 z-20 pt-14 pb-3 px-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-black text-[#2a2a2a]">My Recipes</h1>
          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="w-11 h-11 bg-white border border-[#e8e0d5] rounded-full flex items-center justify-center shadow-sm"
              title="Import JSON"
            >
              <Upload size={18} className="text-[#3D5A3E]" />
            </button>
            <button
              onClick={handleExport}
              className="w-11 h-11 bg-white border border-[#e8e0d5] rounded-full flex items-center justify-center shadow-sm"
              title="Export / Backup"
            >
              <Download size={18} className="text-[#3D5A3E]" />
            </button>
            <button
              onClick={() => navigate("/recipe/new")}
              className="w-11 h-11 bg-[#3D5A3E] rounded-full flex items-center justify-center shadow-lg"
            >
              <Plus size={22} className="text-white" />
            </button>
          </div>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <Search size={16} className="text-[#8a8070]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="flex-1 bg-transparent text-[#2a2a2a] text-sm font-medium outline-none placeholder:text-[#c0b9b0]"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={14} className="text-[#8a8070]" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${showFilters ? "bg-[#3D5A3E]" : "bg-white"}`}
          >
            <SlidersHorizontal size={16} className={showFilters ? "text-white" : "text-[#3D5A3E]"} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.label}
                onClick={() => setActiveDifficulty(d.value)}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                  activeDifficulty === d.value ? "bg-[#3D5A3E] text-white" : "bg-white text-[#3D5A3E] border border-[#e8e0d5]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 mt-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all ${
                activeCategory === cat ? "bg-[#3D5A3E] text-white shadow-sm" : "bg-white text-[#6a6050] border border-[#e8e0d5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* JSON hint */}
      {recipes.length === 0 && !loading && (
        <div className="px-5 mb-2">
          <div className="bg-[#EFF6F0] border border-[#A8C5A0] rounded-2xl px-4 py-3">
            <p className="text-xs text-[#3D5A3E] font-semibold">
              💡 Tip: Use the <Upload size={11} className="inline" /> button to import AI-generated recipes as JSON. Ask an AI to generate a recipe list for you!
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-5 py-2">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#A8C5A0] border-t-[#3D5A3E] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="text-xl font-black text-[#2a2a2a] mb-2">No recipes found</h3>
            <p className="text-[#8a8070] text-sm mb-5">
              {recipes.length === 0 ? "Start building your library!" : "Try a different search or category."}
            </p>
            <button
              onClick={() => navigate("/recipe/new")}
              className="bg-[#3D5A3E] text-white font-bold px-6 py-3 rounded-2xl"
            >
              Add First Recipe
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#8a8070] font-semibold mb-3">
              {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 gap-4 pb-6">
              {filtered.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
