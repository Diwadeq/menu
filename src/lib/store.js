const KEYS = {
  Recipe: 'hb_recipes',
  MealPlan: 'hb_meal_plans',
  ShoppingListItem: 'hb_shopping',
  CookingHistory: 'hb_history',
};

function createStore(key) {
  const getAll = () => JSON.parse(localStorage.getItem(key) || '[]');
  const saveAll = (items) => localStorage.setItem(key, JSON.stringify(items));

  return {
    list(sort, limit) {
      let items = getAll();
      if (sort) {
        const desc = sort.startsWith('-');
        const field = sort.replace(/^-/, '');
        items = [...items].sort((a, b) => {
          if ((a[field] ?? '') < (b[field] ?? '')) return desc ? 1 : -1;
          if ((a[field] ?? '') > (b[field] ?? '')) return desc ? -1 : 1;
          return 0;
        });
      }
      if (limit) items = items.slice(0, limit);
      return Promise.resolve(items);
    },
    get(id) {
      return Promise.resolve(getAll().find((i) => i.id === id) ?? null);
    },
    create(data) {
      const items = getAll();
      const item = { ...data, id: crypto.randomUUID(), created_date: new Date().toISOString() };
      saveAll([...items, item]);
      return Promise.resolve(item);
    },
    update(id, data) {
      const items = getAll();
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) return Promise.resolve(null);
      items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() };
      saveAll(items);
      return Promise.resolve(items[idx]);
    },
    delete(id) {
      saveAll(getAll().filter((i) => i.id !== id));
      return Promise.resolve();
    },
    filter(query) {
      return Promise.resolve(
        getAll().filter((item) => Object.entries(query).every(([k, v]) => item[k] === v))
      );
    },
    bulkCreate(dataArray) {
      const items = getAll();
      const created = dataArray.map((data) => ({
        ...data,
        id: crypto.randomUUID(),
        created_date: new Date().toISOString(),
      }));
      saveAll([...items, ...created]);
      return Promise.resolve(created);
    },
  };
}

export const db = {
  entities: {
    Recipe: createStore(KEYS.Recipe),
    MealPlan: createStore(KEYS.MealPlan),
    ShoppingListItem: createStore(KEYS.ShoppingListItem),
    CookingHistory: createStore(KEYS.CookingHistory),
  },
};

// ── JSON import/export ──────────────────────────────────────────────────────

export function exportData() {
  const out = {};
  for (const [name, key] of Object.entries(KEYS)) {
    out[name] = JSON.parse(localStorage.getItem(key) || '[]');
  }
  return out;
}

/**
 * Import AI-generated JSON. Supports two formats:
 *   Array of recipe objects → imports to library
 *   { recipes?: [...], weekPlan?: { weekStartDate, monday: { breakfast, lunch, dinner }, ... } }
 *     → imports recipes + creates/updates a meal plan for that week
 *       (meal names matched by title to existing recipes; unmatched → created as stubs)
 */
export async function importJSON(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const results = { recipes: 0, plan: false };

  const recipesToImport = Array.isArray(data) ? data : (data.recipes ?? []);

  if (recipesToImport.length) {
    const existing = JSON.parse(localStorage.getItem(KEYS.Recipe) || '[]');
    const newOnes = [];
    for (const r of recipesToImport) {
      const dup = existing.find((e) => e.id === r.id || e.title?.toLowerCase() === r.title?.toLowerCase());
      if (!dup) {
        newOnes.push({ ...r, id: r.id || crypto.randomUUID(), created_date: r.created_date || new Date().toISOString() });
      }
    }
    localStorage.setItem(KEYS.Recipe, JSON.stringify([...existing, ...newOnes]));
    results.recipes = newOnes.length;
  }

  const weekPlan = !Array.isArray(data) && data.weekPlan ? data.weekPlan : null;
  if (weekPlan?.weekStartDate) {
    const allRecipes = JSON.parse(localStorage.getItem(KEYS.Recipe) || '[]');
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const meals = ['breakfast', 'lunch', 'dinner'];
    const planObj = { weekStartDate: weekPlan.weekStartDate };

    for (const day of days) {
      if (!weekPlan[day]) continue;
      planObj[day] = {};
      for (const meal of meals) {
        const title = weekPlan[day][meal];
        if (!title) continue;
        let recipe = allRecipes.find((r) => r.title?.toLowerCase() === title.toLowerCase());
        if (!recipe) {
          recipe = {
            title,
            category: meal === 'breakfast' ? 'Breakfast' : meal === 'dinner' ? 'Dinner' : 'Snacks',
            difficulty: 1,
            id: crypto.randomUUID(),
            created_date: new Date().toISOString(),
          };
          allRecipes.push(recipe);
          localStorage.setItem(KEYS.Recipe, JSON.stringify(allRecipes));
        }
        planObj[day][meal] = recipe.id;
      }
    }

    const plans = JSON.parse(localStorage.getItem(KEYS.MealPlan) || '[]');
    const idx = plans.findIndex((p) => p.weekStartDate === weekPlan.weekStartDate);
    if (idx >= 0) {
      plans[idx] = { ...plans[idx], ...planObj };
    } else {
      plans.push({ ...planObj, id: crypto.randomUUID(), created_date: new Date().toISOString() });
    }
    localStorage.setItem(KEYS.MealPlan, JSON.stringify(plans));
    results.plan = true;
  }

  return results;
}
