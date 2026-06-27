import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Plus, Trash2, Minus } from "lucide-react";
import { db } from "@/lib/store";

const CATEGORIES = ["Breakfast", "Dinner", "Sweets", "Snacks", "Salads", "Soups", "Smoothies"];
const CATEGORY_IMAGES = {
  Breakfast: "https://images.unsplash.com/photo-1484723091739-30990106e5d7?w=800&q=80",
  Dinner: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  Sweets: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
  Snacks: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=800&q=80",
  Salads: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  Soups: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  Smoothies: "https://images.unsplash.com/photo-1610970881699-44a5587cf761?w=800&q=80",
};

const EMPTY = {
  title: "", description: "", category: "Dinner", difficulty: 1,
  prepTime: "", cookTime: "", servings: 2,
  ingredients: [{ name: "", quantity: "", unit: "" }],
  steps: [""],
  calories: "", protein: "", carbs: "", fat: "", imageUrl: "",
};

function Label({ children }) {
  return <label className="text-xs font-bold text-[#6a6050] uppercase tracking-widest mb-1 block">{children}</label>;
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-white border border-[#e8e0d5] rounded-xl px-4 py-3 text-sm text-[#2a2a2a] font-medium outline-none focus:border-[#3D5A3E] transition-colors ${className}`}
      {...props}
    />
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-black text-[#2a2a2a] mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      db.entities.Recipe.get(id).then((data) => {
        if (data) {
          setForm({
            ...EMPTY,
            ...data,
            ingredients: data.ingredients?.length ? data.ingredients : [{ name: "", quantity: "", unit: "" }],
            steps: data.steps?.length ? data.steps : [""],
          });
        }
        setLoading(false);
      });
    }
  }, [id]);

  function set(field, val) { setForm((f) => ({ ...f, [field]: val })); }

  function setIngredient(i, field, val) {
    set("ingredients", form.ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));
  }

  function setStep(i, val) {
    set("steps", form.steps.map((s, idx) => idx === i ? val : s));
  }

  async function handleSave() {
    if (!form.title.trim()) return alert("Please add a recipe title.");
    setSaving(true);
    const data = {
      ...form,
      prepTime: Number(form.prepTime) || 0,
      cookTime: Number(form.cookTime) || 0,
      servings: Number(form.servings) || 1,
      calories: Number(form.calories) || null,
      protein: Number(form.protein) || null,
      carbs: Number(form.carbs) || null,
      fat: Number(form.fat) || null,
      ingredients: form.ingredients.filter((i) => i.name.trim()),
      steps: form.steps.filter((s) => s.trim()),
      imageUrl: form.imageUrl || CATEGORY_IMAGES[form.category] || "",
    };
    if (isEdit) {
      await db.entities.Recipe.update(id, data);
    } else {
      await db.entities.Recipe.create(data);
    }
    navigate("/library");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#A8C5A0] border-t-[#3D5A3E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] lg:max-w-2xl lg:mx-auto">
      {/* Header */}
      <div className="bg-[#FAF6EF] sticky top-0 z-20 px-5 pt-14 pb-4 flex items-center gap-3 border-b border-[#e8e0d5]">
        <button
          onClick={() => navigate('/library')}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <ChevronLeft size={20} className="text-[#2a2a2a]" />
        </button>
        <h1 className="text-xl font-black text-[#2a2a2a] flex-1">
          {isEdit ? "Edit Recipe" : "New Recipe"}
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#3D5A3E] text-white font-bold text-sm px-5 py-2.5 rounded-full disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="px-5 py-5">
        <Section title="Basic Info">
          <div className="flex flex-col gap-3">
            <div>
              <Label>Recipe Name *</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Avocado Toast with Eggs" />
            </div>
            <div>
              <Label>Short Description</Label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What makes this dish special?"
                rows={2}
                className="w-full bg-white border border-[#e8e0d5] rounded-xl px-4 py-3 text-sm text-[#2a2a2a] font-medium outline-none focus:border-[#3D5A3E] transition-colors resize-none"
              />
            </div>
            <div>
              <Label>Photo URL (optional)</Label>
              <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </Section>

        <Section title="Category">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => set("category", cat)}
                className={`text-sm font-bold px-4 py-2 rounded-full transition-all ${
                  form.category === cat ? "bg-[#3D5A3E] text-white" : "bg-white text-[#6a6050] border border-[#e8e0d5]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Difficulty">
          <div className="flex gap-3">
            {[
              { val: 1, label: "Easy", color: "bg-[#A8C5A0] text-[#2a4a2a]" },
              { val: 2, label: "Medium", color: "bg-[#C4A85A] text-[#3a2a00]" },
              { val: 3, label: "Hard", color: "bg-[#C4622D] text-white" },
            ].map(({ val, label, color }) => (
              <button
                key={val}
                onClick={() => set("difficulty", val)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  form.difficulty === val ? color + " shadow-md" : "bg-white text-[#8a8070] border border-[#e8e0d5]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Time & Servings">
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Prep (min)</Label><Input type="number" value={form.prepTime} onChange={(e) => set("prepTime", e.target.value)} placeholder="15" /></div>
            <div><Label>Cook (min)</Label><Input type="number" value={form.cookTime} onChange={(e) => set("cookTime", e.target.value)} placeholder="20" /></div>
            <div><Label>Servings</Label><Input type="number" value={form.servings} onChange={(e) => set("servings", e.target.value)} placeholder="2" /></div>
          </div>
        </Section>

        <Section title="Nutrition (per serving)">
          <div className="grid grid-cols-2 gap-3">
            {[
              { field: "calories", label: "Calories (kcal)", placeholder: "350" },
              { field: "protein", label: "Protein (g)", placeholder: "25" },
              { field: "carbs", label: "Carbs (g)", placeholder: "40" },
              { field: "fat", label: "Fat (g)", placeholder: "12" },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <Label>{label}</Label>
                <Input type="number" value={form[field]} onChange={(e) => set(field, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Ingredients">
          <div className="flex flex-col gap-2 mb-3">
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={ing.name} onChange={(e) => setIngredient(i, "name", e.target.value)} placeholder="Ingredient" className="flex-1" />
                <Input value={ing.quantity} onChange={(e) => setIngredient(i, "quantity", e.target.value)} placeholder="Qty" className="w-16" />
                <Input value={ing.unit} onChange={(e) => setIngredient(i, "unit", e.target.value)} placeholder="g / ml" className="w-16" />
                <button onClick={() => set("ingredients", form.ingredients.filter((_, idx) => idx !== i))} className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <Minus size={14} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => set("ingredients", [...form.ingredients, { name: "", quantity: "", unit: "" }])} className="flex items-center gap-2 text-[#3D5A3E] font-bold text-sm">
            <Plus size={16} /> Add Ingredient
          </button>
        </Section>

        <Section title="Instructions">
          <div className="flex flex-col gap-3 mb-3">
            {form.steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-[#3D5A3E] rounded-full flex items-center justify-center shrink-0 mt-2">
                  <span className="text-white text-xs font-black">{i + 1}</span>
                </div>
                <textarea
                  value={step}
                  onChange={(e) => setStep(i, e.target.value)}
                  placeholder={`Step ${i + 1}...`}
                  rows={2}
                  className="flex-1 bg-white border border-[#e8e0d5] rounded-xl px-4 py-3 text-sm text-[#2a2a2a] font-medium outline-none focus:border-[#3D5A3E] transition-colors resize-none"
                />
                <button onClick={() => set("steps", form.steps.filter((_, idx) => idx !== i))} className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0 mt-2">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => set("steps", [...form.steps, ""])} className="flex items-center gap-2 text-[#3D5A3E] font-bold text-sm">
            <Plus size={16} /> Add Step
          </button>
        </Section>

        <div className="pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#3D5A3E] text-white font-black text-lg py-4 rounded-2xl disabled:opacity-60 active:scale-[0.98] transition-all"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add to Library 🌿"}
          </button>
        </div>
      </div>
    </div>
  );
}
