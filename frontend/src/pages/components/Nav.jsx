import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Utensils,
  User,
  Settings,
  LogOut,
  Flame,
} from "lucide-react";

const Nav = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = ["Dashboard", "Bookings", "Restaurants", "Profile", "Settings"];
  const icons = {
    Dashboard: LayoutDashboard,
    Bookings: Calendar,
    Restaurants: Utensils,
    Profile: User,
    Settings: Settings,
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex shadow-xl">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
          <Flame size={20} fill="currentColor" />
        </div>
        <span className="text-xl font-black tracking-tighter">
          DINE<span className="text-orange-500">SAVVY</span>
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = icons[item];
          const isActive = activeTab === item;

          return (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] ${
                isActive
                  ? "bg-orange-50 text-orange-600 shadow-sm"
                  : "text-slate-400 hover:bg-slate-50 hover:text-orange-500"
              }`}
            >
              <Icon size={18} />
              <span>{item}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Nav;
