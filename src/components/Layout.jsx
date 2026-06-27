import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, BookOpen, CalendarDays, ShoppingCart, Leaf, Snowflake } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/library", label: "Recipes", icon: BookOpen },
  { path: "/planner", label: "Planner", icon: CalendarDays },
  { path: "/shopping", label: "Shopping", icon: ShoppingCart },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF6EF] lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 bg-white border-r border-[#e8e0d5] sticky top-0 h-screen">
        <div className="px-6 py-7 flex items-center gap-2">
          <Leaf size={22} className="text-[#A8C5A0]" />
          <span className="font-black text-lg text-[#2a2a2a]">HealthyBite</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  active ? "bg-[#3D5A3E] text-white shadow-sm" : "text-[#6a6050] hover:bg-[#FAF6EF]"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.9} />
                {label}
              </Link>
            );
          })}
          <Link
            to="/creami"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-[#4A8AB5] hover:bg-[#EEF6FB] transition-all"
          >
            <Snowflake size={20} strokeWidth={1.9} />
            Creami Lab
          </Link>
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        <main className="pb-24 lg:pb-10">
          <div className="w-full max-w-md mx-auto md:max-w-3xl lg:max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#e8e0d5] z-50">
        <div className="flex">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all relative ${
                  active ? "text-[#3D5A3E]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] font-bold tracking-wide ${active ? "text-[#3D5A3E]" : ""}`}>
                  {label}
                </span>
                {active && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-[#3D5A3E] rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
