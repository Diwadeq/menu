import { useState, useEffect } from "react";
import { Plus, Trash2, X, ShoppingCart, RefreshCw, Check } from "lucide-react";
import { format, startOfWeek } from "date-fns";
import { db } from "@/lib/store";

function getWeekStart(date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function weekKey(date) {
  return format(getWeekStart(date), "yyyy-MM-dd");
}

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState("");
  const [generating, setGenerating] = useState(false);
  const wk = weekKey(new Date());

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    setLoading(true);
    const data = await db.entities.ShoppingListItem.filter({ weekStartDate: wk });
    setItems(data);
    setLoading(false);
  }

  async function toggleItem(item) {
    const updated = await db.entities.ShoppingListItem.update(item.id, { checked: !item.checked });
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  async function deleteItem(id) {
    await db.entities.ShoppingListItem.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function addManualItem() {
    if (!newItem.trim()) return;
    const created = await db.entities.ShoppingListItem.create({
      name: newItem.trim(),
      quantity: newQty.trim(),
      isManual: true,
      checked: false,
      weekStartDate: wk,
    });
    setItems((prev) => [...prev, created]);
    setNewItem("");
    setNewQty("");
  }

  async function generateFromPlan() {
    setGenerating(true);
    const plans = await db.entities.MealPlan.filter({ weekStartDate: wk });
    const plan = plans[0];
    if (!plan) {
      alert("No meal plan for this week yet! Add meals in the Planner first.");
      setGenerating(false);
      return;
    }
    const recipeIds = new Set();
    ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].forEach((day) => {
      ["breakfast","lunch","dinner"].forEach((meal) => {
        if (plan[day]?.[meal]) recipeIds.add(plan[day][meal]);
      });
    });
    if (recipeIds.size === 0) {
      alert("No recipes in this week's plan. Add some in the Planner!");
      setGenerating(false);
      return;
    }
    const allRecipes = await Promise.all([...recipeIds].map((id) => db.entities.Recipe.get(id)));
    const ingredientMap = {};
    allRecipes.forEach((recipe) => {
      if (!recipe) return;
      (recipe.ingredients || []).forEach((ing) => {
        const key = ing.name.toLowerCase().trim();
        if (ingredientMap[key]) {
          ingredientMap[key].count += 1;
        } else {
          ingredientMap[key] = { ...ing, count: 1 };
        }
      });
    });
    const existingAuto = items.filter((i) => !i.isManual);
    await Promise.all(existingAuto.map((i) => db.entities.ShoppingListItem.delete(i.id)));
    const newItems = await db.entities.ShoppingListItem.bulkCreate(
      Object.values(ingredientMap).map((ing) => ({
        name: ing.name,
        quantity: ing.quantity || "",
        unit: ing.unit || "",
        checked: false,
        isManual: false,
        weekStartDate: wk,
      }))
    );
    setItems((prev) => [...prev.filter((i) => i.isManual), ...newItems]);
    setGenerating(false);
  }

  async function clearChecked() {
    const checked = items.filter((i) => i.checked);
    await Promise.all(checked.map((i) => db.entities.ShoppingListItem.delete(i.id)));
    setItems((prev) => prev.filter((i) => !i.checked));
  }

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-black text-[#2a2a2a]">Shopping List</h1>
          <ShoppingCart size={24} className="text-[#3D5A3E]" />
        </div>
        <p className="text-sm text-[#8a8070] font-medium mb-4">Week of {wk}</p>

        <button
          onClick={generateFromPlan}
          disabled={generating}
          className="w-full bg-[#3D5A3E] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 mb-4 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          <RefreshCw size={16} className={generating ? "animate-spin" : ""} />
          {generating ? "Generating..." : "Generate from Meal Plan"}
        </button>
      </div>

      {/* Add manual item */}
      <div className="px-5 mb-5">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs font-bold text-[#8a8070] uppercase tracking-widest mb-3">Add Item Manually</p>
          <div className="flex gap-2">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addManualItem()}
              placeholder="Item name..."
              className="flex-1 bg-[#FAF6EF] border border-[#e8e0d5] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3D5A3E]"
            />
            <input
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              placeholder="Qty"
              className="w-16 bg-[#FAF6EF] border border-[#e8e0d5] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3D5A3E]"
            />
            <button
              onClick={addManualItem}
              className="w-10 h-10 bg-[#3D5A3E] rounded-xl flex items-center justify-center shrink-0"
            >
              <Plus size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-5 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#A8C5A0] border-t-[#3D5A3E] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-black text-[#2a2a2a] mb-2">List is empty</h3>
            <p className="text-[#8a8070] text-sm">Generate from your meal plan or add items manually.</p>
          </div>
        ) : (
          <>
            {unchecked.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-[#8a8070] uppercase tracking-widest mb-2">
                  To get ({unchecked.length})
                </p>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-[#f0ece6]">
                  {unchecked.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                      <button
                        onClick={() => toggleItem(item)}
                        className="w-6 h-6 rounded-full border-2 border-[#3D5A3E] flex items-center justify-center shrink-0 hover:bg-[#3D5A3E] transition-colors group"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm text-[#2a2a2a]">{item.name}</span>
                        {(item.quantity || item.unit) && (
                          <span className="text-[#C4622D] font-bold text-xs ml-2">
                            {item.quantity} {item.unit}
                          </span>
                        )}
                        {item.isManual && (
                          <span className="ml-2 text-[10px] text-[#8a8070] bg-[#f0ece6] px-1.5 py-0.5 rounded-full">
                            manual
                          </span>
                        )}
                      </div>
                      <button onClick={() => deleteItem(item.id)}>
                        <X size={16} className="text-[#c0b9b0] hover:text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {checked.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-[#8a8070] uppercase tracking-widest">
                    Done ({checked.length})
                  </p>
                  <button
                    onClick={clearChecked}
                    className="text-xs text-red-400 font-bold flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-[#f0ece6] opacity-60">
                  {checked.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <button
                        onClick={() => toggleItem(item)}
                        className="w-6 h-6 rounded-full bg-[#3D5A3E] flex items-center justify-center shrink-0"
                      >
                        <Check size={14} className="text-white" />
                      </button>
                      <span className="font-semibold text-sm text-[#8a8070] line-through flex-1">
                        {item.name}
                      </span>
                      <button onClick={() => deleteItem(item.id)}>
                        <X size={16} className="text-[#c0b9b0]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
