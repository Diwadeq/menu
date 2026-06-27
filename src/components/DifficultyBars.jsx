export default function DifficultyBars({ level, size = "sm" }) {
  const heights = size === "lg"
    ? ["h-[10px]", "h-[16px]", "h-[22px]"]
    : ["h-[7px]", "h-[11px]", "h-[15px]"];
  const width = size === "lg" ? "w-[5px]" : "w-[4px]";

  return (
    <div className="flex items-end gap-[3px]">
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={`${width} ${heights[bar - 1]} rounded-sm transition-all ${
            bar <= level ? "bg-[#3D5A3E]" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}