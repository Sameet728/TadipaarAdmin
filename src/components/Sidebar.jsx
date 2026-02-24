import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  MapPin,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  /* ================= TOGGLE ================= */

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ================= MENU ================= */

  const menu = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: ["DCP", "ACP", "STATION_ADMIN"],
    },
    {
      name: "Tadipaar Monitoring",
      path: "/tadipaar-tracking",
      icon: ShieldAlert,
      roles: ["DCP", "ACP", "STATION_ADMIN"],
    },
    {
      name: "Externed Persons",
      path: "/criminals",
      icon: ShieldAlert,
      roles: ["DCP", "ACP", "STATION_ADMIN"],
    },
    {
      name: "Restricted Areas",
      path: "/restricted-areas",
      icon: MapPin,
      roles: ["DCP", "ACP", "STATION_ADMIN"],
    },
    {
      name: "Officers",
      path: "/officers",
      icon: Users,
      roles: ["DCP", "ACP"], // ❗ hidden from station admin
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
      roles: ["DCP", "ACP", "STATION_ADMIN"],
    },
  ];

  /* ================= UI ================= */

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-[#0B3D91] text-white flex flex-col border-r border-blue-900 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div className="px-4 py-4 border-b border-blue-900 flex items-center justify-between">
        {!collapsed && (
          <div className="leading-tight">
            <h1 className="text-lg font-semibold tracking-wide">
              Tadipaar Admin
            </h1>
            <p className="text-xs text-blue-200">Maharashtra Police</p>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-blue-800 rounded-md transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ================= ROLE BADGE ================= */}
      {!collapsed && role && (
        <div className="px-4 py-3">
          <div className="inline-block px-2 py-1 text-[11px] rounded bg-[#CFAE5B] text-black font-medium">
            {role}
          </div>
        </div>
      )}

      {/* ================= NAV ================= */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {menu
          .filter((item) => role && item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center ${
                    collapsed ? "justify-center" : "gap-3"
                  } px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#0B3D91] font-medium shadow-sm"
                      : "text-blue-100 hover:bg-blue-800"
                  }`
                }
              >
                <Icon size={18} />
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </NavLink>
            );
          })}
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="p-3 border-t border-blue-900">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? "justify-center" : "justify-center gap-2"
          } bg-red-600 hover:bg-red-700 transition py-2.5 rounded-md text-sm font-medium`}
        >
          <LogOut size={16} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}   