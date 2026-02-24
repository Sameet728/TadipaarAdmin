import React, { useState } from "react";

export default function AddCriminalScreen() {
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔐 safety guard (extra layer)
  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-600">Unauthorized access</p>
      </div>
    );
  }

  const [form, setForm] = useState({
    name: "",
    aadhaar: "",
    from_area: "",
    start_date: "",
    end_date: "",
  });

  // 🔹 load areas for dropdown
  const areas =
    JSON.parse(localStorage.getItem("restrictedAreas")) || [];

  // 🔹 submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const existing =
      JSON.parse(localStorage.getItem("criminals")) || [];

    const newRecord = {
      id: Date.now(),
      ...form,
      created_by: user.name,
      created_by_role: user.role,
      police_station: user.police_station,
    };

    const updated = [newRecord, ...existing];

    localStorage.setItem("criminals", JSON.stringify(updated));

    // reset form
    setForm({
      name: "",
      aadhaar: "",
      from_area: "",
      start_date: "",
      end_date: "",
    });

    alert("Externed person registered successfully");
  };

  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0B3D91] mb-6">
        Register Externed Person
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow max-w-xl space-y-3"
      >
        {/* Name */}
        <input
          required
          placeholder="Full Name"
          className="w-full p-2 border rounded-lg"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* Aadhaar */}
        <input
          required
          placeholder="Aadhaar Number"
          className="w-full p-2 border rounded-lg"
          value={form.aadhaar}
          onChange={(e) =>
            setForm({ ...form, aadhaar: e.target.value })
          }
        />

        {/* Area dropdown */}
        <select
          required
          className="w-full p-2 border rounded-lg"
          value={form.from_area}
          onChange={(e) =>
            setForm({ ...form, from_area: e.target.value })
          }
        >
          <option value="">Select Tadipaar Area</option>
          {areas.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>

        {/* Start date */}
        <div>
          <label className="text-sm text-gray-600">
            Start Date
          </label>
          <input
            required
            type="date"
            className="w-full p-2 border rounded-lg"
            value={form.start_date}
            onChange={(e) =>
              setForm({ ...form, start_date: e.target.value })
            }
          />
        </div>

        {/* End date */}
        <div>
          <label className="text-sm text-gray-600">
            End Date
          </label>
          <input
            required
            type="date"
            className="w-full p-2 border rounded-lg"
            value={form.end_date}
            onChange={(e) =>
              setForm({ ...form, end_date: e.target.value })
            }
          />
        </div>

        {/* Submit */}
        <button className="w-full bg-[#0B3D91] text-white py-2 rounded-lg font-medium">
          Register Criminal
        </button>
      </form>
    </div>
  );
}