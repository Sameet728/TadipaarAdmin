import React, { useState } from "react";
import demoUsers from "../utils/dummyDB";
export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  /* =====================================================
     🔐 LOGIN HANDLER
  ===================================================== */

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // 🔍 find matching user
    const user = demoUsers.find(
      (u) =>
        u.username === form.username &&
        u.password === form.password
    );

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    // ✅ store user session
    localStorage.setItem("user", JSON.stringify(user));

    /* =====================================================
       🚔 ROLE BASED REDIRECT (IMPORTANT)
    ===================================================== */

    if (user.role === "CP") {
      window.location.href = "/cp-dashboard";
    } else if (user.role === "DCP") {
      window.location.href = "/dcp-dashboard";
    } else if (user.role === "ACP") {
      window.location.href = "/acp-dashboard";
    } else if (user.role === "PSI" || user.role === "STATION_ADMIN") {
      window.location.href = "/police-station";
    } else if (user.role === "CRIMINAL") {
      window.location.href = "/criminal-dashboard";
    } else {
      window.location.href = "/";
    }
  };

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#0B3D91] mb-1 text-center">
          Maharashtra Police
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Tadipaar Monitoring System
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            required
            placeholder="Username"
            className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            required
            type="password"
            placeholder="Password"
            className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button className="w-full bg-[#0B3D91] hover:bg-blue-900 text-white py-2.5 rounded-lg font-medium transition">
            🔐 Login
          </button>
        </form>

        {/* Demo credentials */}
<div className="mt-6 text-xs text-gray-500 border-t pt-4 space-y-1">
  <p className="font-semibold text-gray-700">
    Demo Accounts:
  </p>
  <p>CP → cp_pune / 123456</p>
  <p>DCP → dcp_pune / 123456</p>
  <p>ACP → acp_zone1 / 123456</p>
  <p>Station Admin → station_admin / 123456</p>
  <p>Criminal → ramesh_k / 123</p>
</div>
      </div>
    </div>
  );
}