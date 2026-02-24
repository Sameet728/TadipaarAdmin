import React, { useState } from "react";
import demoUsers from "../data/demoUsers";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // 🔹 find matching user
    const user = demoUsers.find(
      (u) =>
        u.username === form.username &&
        u.password === form.password
    );

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    // 🔥 store session
    localStorage.setItem("user", JSON.stringify(user));

    // redirect
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border w-full max-w-md items-center justify-center">
        <h1 className="text-2xl font-bold text-[#0B3D91] mb-2 text-center">
          Maharashtra Police
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Tadipaar Monitoring Login
        </p>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            required
            placeholder="Username"
            className="w-full p-2 border rounded-lg"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            required
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button className="w-full bg-[#0B3D91] text-white py-2 rounded-md font-medium">
            Login
          </button>
        </form>

        {/* Demo creds */}
        <div className="mt-6 text-xs text-gray-500 border-t pt-4">
          <p className="font-medium mb-1">Demo Accounts:</p>
          <p>DCP → dcp_pune / 123456</p>
          <p>ACP → acp_zone1 / 123456</p>
          <p>Station → station_admin / 123456</p>
        </div>
      </div>
    </div>
  );
}