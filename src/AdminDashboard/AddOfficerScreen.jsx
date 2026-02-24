import React, { useState } from "react";

export default function AddOfficerScreen() {
  const [form, setForm] = useState({ name: "", buckle: "" });

  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0B3D91] mb-6">
        Add Officer
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow max-w-xl">
        <input
          placeholder="Officer Name"
          className="w-full mb-3 p-2 border rounded-lg"
        />
        <input
          placeholder="Buckle Number"
          className="w-full mb-3 p-2 border rounded-lg"
        />

        <button className="bg-[#0B3D91] text-white px-6 py-2 rounded-lg">
          Register Officer
        </button>
      </div>
    </div>
  );
}