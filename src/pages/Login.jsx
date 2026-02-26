import React, { useState } from "react";
import demoUsers from "../utils/dummyDB";

export default function Login() {
  // Component state for authentication fields
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Authentication validation and routing handler
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Validate provided credentials against the local database
    const user = demoUsers.find(
      (u) => u.username === form.username && u.password === form.password
    );

    if (!user) {
      setError("Authentication failed. Invalid official username or password.");
      return;
    }

    // Establish secure user session
    localStorage.setItem("user", JSON.stringify(user));

    // Execute role-based access control and routing
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
        
        {/* Portal Header */}
        <div className="text-center mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold text-[#0B3D91] tracking-wide uppercase">
            Maharashtra Police
          </h1>
          <p className="text-gray-600 text-sm mt-1 font-medium">
            Tadipaar Monitoring Portal
          </p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Official Username
            </label>
            <input
              required
              type="text"
              placeholder="Enter your assigned ID"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all text-sm"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Secure Password
            </label>
            <input
              required
              type="password"
              placeholder="Enter your password"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all text-sm"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#0B3D91] hover:bg-[#082a66] text-white py-3 rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3D91] shadow-sm mt-2"
          >
            Secure Authorization
          </button>
        </form>

        {/* Development / Testing Credentials */}
        <div className="mt-8 bg-gray-50 p-4 rounded-md border border-gray-200 text-xs text-gray-600 space-y-1.5">
          <p className="font-bold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
            System Access Profiles
          </p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <p><span className="font-semibold text-gray-800">CP:</span> cp_pune / 123456</p>
            <p><span className="font-semibold text-gray-800">DCP:</span> dcp_pune / 123456</p>
            <p><span className="font-semibold text-gray-800">ACP:</span> acp_zone1 / 123456</p>
            <p><span className="font-semibold text-gray-800">Station:</span> station_admin / 123456</p>
            <p className="col-span-2 pt-1 border-t border-gray-200 mt-1">
              <span className="font-semibold text-gray-800">Subject (Externee):</span> ramesh_k / 123
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}