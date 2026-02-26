import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* 🔷 Pages */
import Login from "./pages/Login";
import CriminalDashboard from "./pages/CriminalDashboard";
import PoliceStation from "./pages/PoliceStation";
import ACPDashboard from "./pages/ACPDashboard";
import DCPDashboard from "./pages/DCPDashboard";
import CPDashboard from "./pages/CPDashboard";
import AddExternee from "./pages/AddExternee";

/* 🔷 Layout */
import ProtectedRoutee from "./components/ProtectedRoute";

/* =====================================================
   🧠 Helper: get dashboard by role
===================================================== */

const getDashboardByRole = (role) => {
  switch (role) {
    case "CP":
      return "/cp-dashboard";
    case "DCP":
      return "/dcp-dashboard";
    case "ACP":
      return "/acp-dashboard";
    case "STATION_ADMIN":
    case "PSI":
      return "/police-station";
    case "CRIMINAL":
      return "/criminal-dashboard";
    default:
      return "/login";
  }
};

/* =====================================================
   🔐 Root Redirect Component
===================================================== */

const RootRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={getDashboardByRole(user.role)} replace />;
};

/* =====================================================
   🔐 Login Guard (prevent logged users from seeing login)
===================================================== */

const LoginGuard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return <Navigate to={getDashboardByRole(user.role)} replace />;
  }

  return <Login />;
};

/* ================= APP ================= */

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 ROOT */}
        <Route path="/" element={<RootRedirect />} />

        {/* 🔓 LOGIN (guarded) */}
        <Route path="/login" element={<LoginGuard />} />

        {/* 👮 CRIMINAL */}
        <Route
          path="/criminal-dashboard"
          element={
            <ProtectedRoutee allowedRoles={["CRIMINAL"]}>
              <CriminalDashboard />
            </ProtectedRoutee>
          }
        />

        {/* 👑 CP */}
        <Route
          path="/cp-dashboard"
          element={
            <ProtectedRoutee allowedRoles={["CP"]}>
              <CPDashboard />
            </ProtectedRoutee>
          }
        />

        {/* 🏛️ DCP */}
        <Route
          path="/dcp-dashboard"
          element={
            <ProtectedRoutee allowedRoles={["DCP"]}>
              <DCPDashboard />
            </ProtectedRoutee>
          }
        />

        {/* 🧭 ACP */}
        <Route
          path="/acp-dashboard"
          element={
            <ProtectedRoutee allowedRoles={["ACP"]}>
              <ACPDashboard />
            </ProtectedRoutee>
          }
        />

        {/* 🚔 PSI */}
        <Route
          path="/police-station"
          element={
            <ProtectedRoutee allowedRoles={["STATION_ADMIN", "PSI"]}>
              <PoliceStation />
            </ProtectedRoutee>
          }
        />

        {/* ➕ ADD EXTERNEE */}
        <Route
          path="/add-externee"
          element={
            <ProtectedRoutee allowedRoles={["CP", "DCP"]}>
              <AddExternee />
            </ProtectedRoutee>
          }
        />

        {/* ❌ fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}