import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, BookOpen, CalendarDays, ShoppingCart, Snowflake } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/library", label: "Recipes", icon: BookOpen },
  { path: "/planner", label: "Planner", icon: CalendarDays },
  { path: "/shopping", label: "Shopping", icon: ShoppingCart },
  { path: "/creami", label: "Creami", icon: Snowflake },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex flex-col max-w-md mx-auto relative">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#e8e0d5] z-50">
        <div className="flex">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            const isCreami = path === '/creami';
            const activeColor = isCreami ? 'text-[#6BB5E8]' : 'text-[#3D5A3E]';
            const activeBg = isCreami ? 'bg-[#6BB5E8]' : 'bg-[#3D5A3E]';
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all relative ${
                  active ? activeColor : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] font-bold tracking-wide ${active ? activeColor : ""}`}>
                  {label}
                </span>
                {active && (
                  <div className={`absolute bottom-0 w-8 h-0.5 ${activeBg} rounded-t-full`} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
