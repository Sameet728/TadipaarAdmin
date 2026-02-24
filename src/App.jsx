import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* 🔷 Pages */
import Login from "./pages/Login";
import DashboardHome from "./AdminDashboard/DashboardHome";
import OfficersScreen from "./AdminDashboard/OfficersScreen";
import CriminalsScreen from "./AdminDashboard/CriminalsScreen";
import RestrictedAreasScreen from "./AdminDashboard/RestrictedAreasScreen";
import TadipaarTrackingScreen from "./AdminDashboard/TadipaarTrackingScreen";
import Profile from "./AdminDashboard/Profile";

/* 🔷 Layout */
import Sidebar from "./components/Sidebar";

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* ================= APP ================= */

export default function App() {
  // 🔥 GLOBAL SIDEBAR STATE (IMPORTANT)
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  return (
    <Router>
      <Routes>
        {/* 🔓 LOGIN (Standalone — NO sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 PROTECTED APP */}
        <Route
          path="/*"
          element={
            <ProtectedRoute allowedRoles={["DCP", "ACP", "STATION_ADMIN"]}>
              <div className="flex bg-[#F4F6F9] min-h-screen">
                {/* ✅ Sidebar */}
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* ✅ Main Content — GAP FIXED */}
                <main
                  className={`flex-1 transition-all duration-300 ${
                    collapsed ? "ml-20" : "ml-64"
                  }`}
                >
                  <Routes>
                    <Route path="/" element={<DashboardHome />} />

                    <Route
                      path="/officers"
                      element={
                        <ProtectedRoute allowedRoles={["DCP", "ACP"]}>
                          <OfficersScreen />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/criminals" element={<CriminalsScreen />} />
                    <Route
                      path="/restricted-areas"
                      element={<RestrictedAreasScreen />}
                    />
                    <Route
                      path="/tadipaar-tracking"
                      element={<TadipaarTrackingScreen />}
                    />
                    <Route path="/profile" element={<Profile />} />

                    {/* fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}