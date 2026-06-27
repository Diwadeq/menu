import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Snowflake } from "lucide-react";
import { CREAMI_RECIPES, CREAMI_TAGS } from "@/data/creamiRecipes";

const GROUP_LABEL = { YT: '📺 YT Recipes', Random: '📖 Random Recipes' };

export default function Creami() {
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = CREAMI_RECIPES.filter((r) => {
    const matchTag = activeTag === "All" || r.tags.includes(activeTag);
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
    return matchTag && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Snowflake size={18} className="text-[#6BB5E8]" />
          <span className="text-xs font-bold text-[#6BB5E8] tracking-widest uppercase">Sweet Lab</span>
        </div>
        <h1 className="text-3xl font-black text-[#2a2a2a] leading-tight">
          🍦 Creami Recipes
        </h1>
        <p className="text-sm text-[#8a8070] mt-1 font-medium">
          Prepare tonight — enjoy tomorrow. Freeze 24h minimum.
        </p>

        {/* Freeze reminder */}
        <div className="mt-3 bg-[#EEF6FB] border border-[#B8DDF5] rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <Snowflake size={14} className="text-[#6BB5E8] shrink-0" />
          <p className="text-xs text-[#4A8AB5] font-semibold">
            All bases need 24h freeze. Start <strong>tonight</strong> to have them ready tomorrow.
          </p>
        </div>

        {/* Search */}
        <div className="mt-3 bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-2">
          <span className="text-[#8a8070]">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className="flex-1 text-sm bg-transparent outline-none text-[#2a2a2a] placeholder:text-[#c0b9b0] font-medium"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={14} className="text-[#8a8070]" />
            </button>
          )}
        </div>

        {/* Tag filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 mt-3 scrollbar-hide">
          {CREAMI_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all ${
                activeTag === tag
                  ? "bg-[#6BB5E8] text-white shadow-sm"
                  : "bg-white text-[#6a6050] border border-[#e8e0d5]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe grid */}
      <div className="px-5 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-3">🍦</div>
            <p className="text-[#8a8070] font-semibold">No recipes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((r) => (
              <motion.div
                key={r.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(r)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer border border-[#f0ece6]"
              >
                <div className="bg-gradient-to-br from-[#FFF3E6] to-[#FFE8D0] flex items-center justify-center text-4xl py-5">
                  {r.emoji}
                </div>
                <div className="px-3 py-2.5">
                  <p className="font-bold text-[13px] text-[#2a2a2a] leading-tight line-clamp-2">{r.title}</p>
                  {r.subtitle && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#6BB5E8] bg-[#EEF6FB] px-2 py-0.5 rounded-full">
                      {r.subtitle}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {r.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] font-bold text-[#C4622D] bg-[#FDE8D4] px-1.5 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      r.group === 'YT' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {GROUP_LABEL[r.group]}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="bg-white rounded-t-3xl mt-16 mx-0 sm:mx-auto sm:max-w-lg sm:rounded-3xl sm:mt-10 overflow-hidden"
            >
              {/* Hero */}
              <div className="bg-gradient-to-br from-[#FFF3E6] to-[#FFE8D0] text-center py-8 relative">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
                >
                  <X size={16} className="text-[#2a2a2a]" />
                </button>
                <div className="text-6xl mb-2">{selected.emoji}</div>
              </div>

              <div className="px-5 py-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-[#2a2a2a] leading-tight">{selected.title}</h2>
                    {selected.subtitle && (
                      <span className="inline-block mt-1 text-xs font-bold text-[#6BB5E8] bg-[#EEF6FB] px-2.5 py-0.5 rounded-full">
                        {selected.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#6a6050] mb-3 leading-relaxed">{selected.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selected.tags.map((t) => (
                    <span key={t} className="text-[10px] font-bold text-[#C4622D] bg-[#FDE8D4] px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Freeze reminder */}
                <div className="bg-[#EEF6FB] rounded-xl px-3 py-2 flex items-center gap-2 mb-4">
                  <Snowflake size={13} className="text-[#6BB5E8] shrink-0" />
                  <p className="text-[11px] text-[#4A8AB5] font-semibold">
                    Freeze {selected.id === 'c2' ? '36' : '24'}h minimum before spinning
                  </p>
                </div>

                {selected.sections.map((sec, i) => (
                  <div key={i} className="mb-5">
                    <h3 className="text-xs font-bold text-[#8a8070] uppercase tracking-widest mb-2">
                      {sec.label}
                    </h3>
                    {sec.type === 'ing' ? (
                      <div className="bg-[#FAF6EF] rounded-2xl divide-y divide-[#f0ece6]">
                        {sec.items.map((ing, j) => (
                          <div key={j} className="flex items-center justify-between px-4 py-2.5">
                            <span className="text-sm text-[#2a2a2a] font-medium">{ing.n}</span>
                            <span className="text-sm font-bold text-[#C4622D]">{ing.a}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {sec.items.map((step, j) => (
                          <div key={j} className="flex gap-3">
                            <div className="w-7 h-7 bg-[#C4622D] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-white text-xs font-black">{j + 1}</span>
                            </div>
                            <p className="text-sm text-[#2a2a2a] leading-relaxed flex-1 pt-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {selected.ytUrl && (
                  <a
                    href={selected.ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-red-600 text-white font-bold py-3.5 rounded-2xl mt-2 mb-4"
                  >
                    <ExternalLink size={16} />
                    Watch on YouTube
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
