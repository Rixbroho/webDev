import React from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const AdminNav = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Bookings", icon: Calendar },
    { name: "Restaurants", icon: MapPin },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Brand Section */}
      <div className="p-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-orange-600 to-red-600 p-2.5 rounded-xl shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
              DINE<span className="text-orange-600">SAVVY</span>
            </span>
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">
              Admin Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] ${
                isActive
                  ? "bg-orange-50 text-orange-700 shadow-sm shadow-orange-50/50"
                  : "text-slate-400 hover:bg-slate-50 hover:text-orange-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon
                  size={18}
                  className={`${isActive ? "text-orange-600" : "text-slate-400 group-hover:text-orange-500"} transition-colors`}
                />
                <span
                  className={`text-sm font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-80"}`}
                >
                  {item.name}
                </span>
              </div>

              {/* Active Indicator Dot */}
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Logout Section over here*/}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 rounded-[1.5rem] p-5 mb-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-100">
              AD
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-black text-slate-900 truncate">
                Master Admin
              </span>
              <span className="text-[10px] text-slate-500 font-bold truncate">
                admin@dinesavvy.com
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-200 group font-black text-sm uppercase tracking-widest"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminNav;
