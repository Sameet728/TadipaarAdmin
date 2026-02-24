import React, { useState } from "react";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [user, setUser] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: user.name || "",
    police_station: user.police_station || "",
    mobile: user.mobile || "",
    rank: user.rank || "",
    buckle_number: user.buckle_number || "",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // 🔹 Save profile
  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      ...form,
    };

    setUser(updatedUser);

    // 🔥 persist globally
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      police_station: user.police_station || "",
      mobile: user.mobile || "",
      rank: user.rank || "",
      buckle_number: user.buckle_number || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0B3D91] mb-6">
        Officer Profile
      </h1>

      <div className="max-w-2xl bg-white rounded-xl shadow-sm border p-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0B3D91] text-white flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0) || "O"}
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-800">
              {user?.name || "Officer"}
            </p>

            <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-[#CFAE5B] text-black font-medium">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="border-t my-6" />

        {/* 🔥 EDIT MODE */}
        {isEditing ? (
          <form onSubmit={handleSave} className="grid gap-4">
            <input
              className="p-2 border rounded-lg"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="p-2 border rounded-lg"
              placeholder="Police Station"
              value={form.police_station}
              onChange={(e) =>
                setForm({
                  ...form,
                  police_station: e.target.value,
                })
              }
            />

            <input
              className="p-2 border rounded-lg"
              placeholder="Mobile"
              value={form.mobile}
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
            />

            <input
              className="p-2 border rounded-lg"
              placeholder="Rank"
              value={form.rank}
              onChange={(e) =>
                setForm({ ...form, rank: e.target.value })
              }
            />

            <input
              className="p-2 border rounded-lg"
              placeholder="Buckle Number"
              value={form.buckle_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  buckle_number: e.target.value,
                })
              }
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#0B3D91] text-white py-2 rounded-md text-sm font-medium"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 border py-2 rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* VIEW MODE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBox label="Police Station" value={user.police_station} />
              <InfoBox label="Mobile" value={user.mobile} />
              <InfoBox label="Rank" value={user.rank} />
              <InfoBox
                label="Buckle Number"
                value={user.buckle_number}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#0B3D91] text-white rounded-md text-sm font-medium"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-500 text-red-600 rounded-md text-sm font-medium hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 🔹 small reusable box
function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 border rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || "—"}</p>
    </div>
  );
}