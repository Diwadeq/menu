import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sunrise, Sun, Moon, Plus, X, History, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns";
import { db, importJSON } from "@/lib/store";

const MEALS = [
  { key: "breakfast", label: "Breakfast", icon: Sunrise, color: "text-[#C4A85A]" },
  { key: "lunch", label: "Lunch", icon: Sun, color: "text-[#C4622D]" },
  { key: "dinner", label: "Dinner", icon: Moon, color: "text-[#3D5A3E]" },
];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekStart(date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function weekKey(date) {
  return format(getWeekStart(date), "yyyy-MM-dd");
}

export default function Planner() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [plan, setPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [activeTab, setActiveTab] = useState("planner");
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);

  const wk = weekKey(currentWeek);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    db.entities.Recipe.list().then(setRecipes);
    db.entities.CookingHistory.list("-cookedDate", 50).then(setHistory);
  }, []);

  useEffect(() => {
    setLoading(true);
    db.entities.MealPlan.filter({ weekStartDate: wk }).then((data) => {
      setPlan(data[0] || null);
      setLoading(false);
    });
  }, [wk]);

  async function assignMeal(day, meal, recipeId) {
    const update = { [day]: { ...(plan?.[day] || {}), [meal]: recipeId } };
    if (plan) {
      const updated = await db.entities.MealPlan.update(plan.id, update);
      setPlan(updated);
    } else {
      const created = await db.entities.MealPlan.create({ weekStartDate: wk, ...update });
      setPlan(created);
    }
    setShowPicker(null);
  }

  async function removeMeal(day, meal) {
    if (!plan) return;
    const updated = await db.entities.MealPlan.update(plan.id, {
      [day]: { ...(plan[day] || {}), [meal]: null },
    });
    setPlan(updated);
  }

  function getRecipeName(id) {
    return recipes.find((r) => r.id === id)?.title || "";
  }

  async function handleImportPlan(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = await importJSON(text);
      const freshRecipes = await db.entities.Recipe.list();
      const freshPlan = await db.entities.MealPlan.filter({ weekStartDate: wk });
      setRecipes(freshRecipes);
      setPlan(freshPlan[0] || null);
      const msgs = [];
      if (result.recipes > 0) msgs.push(`${result.recipes} new recipe${result.recipes > 1 ? 's' : ''}`);
      if (result.plan) msgs.push('meal plan loaded');
      showToast(msgs.length ? `Imported: ${msgs.join(', ')}` : 'Nothing new to import');
    } catch {
      showToast('Import failed — check JSON format');
    }
    e.target.value = '';
  }

  const weekStartDate = getWeekStart(currentWeek);
  const pickerRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const grouped = history.reduce((acc, h) => {
    const date = h.cookedDate?.split("T")[0] || "Unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(h);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a2a] text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-black text-[#2a2a2a]">Meal Planner</h1>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-10 h-10 bg-white border border-[#e8e0d5] rounded-full flex items-center justify-center shadow-sm"
            title="Import AI plan (JSON)"
          >
            <Upload size={17} className="text-[#3D5A3E]" />
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportPlan} />
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm mb-4">
          {["planner", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab ? "bg-[#3D5A3E] text-white shadow-sm" : "text-[#8a8070]"
              }`}
            >
              {tab === "history" && <History size={14} />}
              {tab === "planner" ? "Week Plan" : "History"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "planner" ? (
        <>
          {/* Week navigator */}
          <div className="flex items-center justify-between px-5 mb-4">
            <button
              onClick={() => setCurrentWeek((d) => subWeeks(d, 1))}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              <ChevronLeft size={18} className="text-[#3D5A3E]" />
            </button>
            <div className="text-center">
              <p className="text-sm font-black text-[#2a2a2a]">
                {format(weekStartDate, "MMM d")} – {format(addDays(weekStartDate, 6), "MMM d, yyyy")}
              </p>
              {isSameDay(weekStartDate, getWeekStart(new Date())) && (
                <p className="text-xs text-[#8a8070] font-medium">This week</p>
              )}
            </div>
            <button
              onClick={() => setCurrentWeek((d) => addWeeks(d, 1))}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              <ChevronRight size={18} className="text-[#3D5A3E]" />
            </button>
          </div>

          {/* JSON import hint */}
          <div className="px-5 mb-3">
            <div className="bg-[#EFF6F0] border border-[#A8C5A0] rounded-xl px-3 py-2">
              <p className="text-[11px] text-[#3D5A3E] font-semibold">
                💡 Tap <Upload size={9} className="inline" /> to import an AI-generated weekly plan as JSON
              </p>
            </div>
          </div>

          {/* Planner grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-[#A8C5A0] border-t-[#3D5A3E] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="px-5 flex flex-col gap-3 pb-6">
              {DAYS.map((day, di) => {
                const dayDate = addDays(weekStartDate, di);
                const isToday = isSameDay(dayDate, new Date());
                return (
                  <div
                    key={day}
                    className={`bg-white rounded-2xl shadow-sm overflow-hidden ${isToday ? "ring-2 ring-[#3D5A3E]" : ""}`}
                  >
                    <div className={`px-4 py-2.5 flex items-center gap-2 ${isToday ? "bg-[#3D5A3E]" : "bg-[#FAF6EF]"}`}>
                      <span className={`font-black text-sm ${isToday ? "text-white" : "text-[#2a2a2a]"}`}>
                        {DAY_LABELS[di]}
                      </span>
                      <span className={`text-xs font-medium ${isToday ? "text-white/70" : "text-[#8a8070]"}`}>
                        {format(dayDate, "MMM d")}
                      </span>
                      {isToday && (
                        <span className="ml-auto text-white text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                    <div className="divide-y divide-[#f0ece6]">
                      {MEALS.map(({ key, label, icon: Icon, color }) => {
                        const assigned = plan?.[day]?.[key];
                        return (
                          <div key={key} className="flex items-center gap-3 px-4 py-2.5">
                            <Icon size={14} className={color} />
                            <span className="text-xs font-bold text-[#8a8070] w-16 shrink-0">{label}</span>
                            {assigned ? (
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <button
                                  onClick={() => navigate(`/recipe/${assigned}`)}
                                  className="text-sm font-bold text-[#3D5A3E] truncate flex-1 text-left hover:underline"
                                >
                                  {getRecipeName(assigned)}
                                </button>
                                <button onClick={() => removeMeal(day, key)}>
                                  <X size={14} className="text-[#c0b9b0] hover:text-red-400" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setShowPicker({ day, meal: key }); setPickerSearch(""); }}
                                className="flex items-center gap-1 text-xs text-[#c0b9b0] hover:text-[#3D5A3E] transition-colors"
                              >
                                <Plus size={13} /> Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="px-5 pb-6">
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-black text-[#2a2a2a] mb-2">No cooking history yet</h3>
              <p className="text-[#8a8070] text-sm">Mark recipes as cooked to see them here!</p>
            </div>
          ) : (
            Object.entries(grouped)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, entries]) => (
                <div key={date} className="mb-5">
                  <p className="text-xs font-bold text-[#8a8070] uppercase tracking-widest mb-2">{date}</p>
                  <div className="bg-white rounded-2xl shadow-sm divide-y divide-[#f0ece6]">
                    {entries.map((h) => (
                      <div key={h.id} className="px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#A8C5A0] rounded-full flex items-center justify-center">
                          <span className="text-lg">🍽️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#2a2a2a] truncate">{h.recipeTitle}</p>
                          {h.notes && <p className="text-xs text-[#8a8070]">{h.notes}</p>}
                        </div>
                        <button
                          onClick={() => navigate(`/recipe/${h.recipeId}`)}
                          className="text-xs text-[#3D5A3E] font-bold"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Recipe picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-[#FAF6EF] rounded-t-3xl max-h-[70vh] flex flex-col">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="font-black text-[#2a2a2a]">Choose Recipe</h2>
              <button onClick={() => setShowPicker(null)}>
                <X size={20} className="text-[#8a8070]" />
              </button>
            </div>
            <div className="px-5 pb-3">
              <input
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full bg-white border border-[#e8e0d5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3D5A3E]"
              />
            </div>
            <div className="overflow-y-auto flex-1 px-5 pb-8 divide-y divide-[#e8e0d5]">
              {pickerRecipes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => assignMeal(showPicker.day, showPicker.meal, r.id)}
                  className="w-full flex items-center gap-3 py-3 text-left hover:bg-[#f0ece6] rounded-xl px-2 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#e8e0d5] rounded-xl overflow-hidden shrink-0">
                    {r.imageUrl && <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#2a2a2a] truncate">{r.title}</p>
                    <p className="text-xs text-[#8a8070]">{r.category}</p>
                  </div>
                </button>
              ))}
              {pickerRecipes.length === 0 && (
                <div className="text-center py-8 text-[#8a8070] text-sm">No recipes found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
