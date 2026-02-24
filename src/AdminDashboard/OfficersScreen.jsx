import React, { useState } from "react";
import { canViewAll, canDeleteOfficer } from "../utils/roleUtils";

export default function OfficersScreen() {
  const user = JSON.parse(localStorage.getItem("user"));
  const canAddOfficer = ["DCP", "ACP"].includes(user?.role);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [officers, setOfficers] = useState([
    {
      id: 1,
      name: "Rahul Patil",
      buckle_number: "MP1234",
      police_station: "Shivajinagar",
      rank: "PI",
      mobile: "9876543210",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    buckle_number: "",
    police_station: "",
    rank: "",
    mobile: "",
  });

  // 🔹 Add officer
  const handleAddOfficer = (e) => {
    e.preventDefault();

    const newOfficer = {
      id: Date.now(),
      ...form,
    };

    setOfficers((prev) => [newOfficer, ...prev]);
    setForm({
      name: "",
      buckle_number: "",
      police_station: "",
      rank: "",
      mobile: "",
    });
    setShowForm(false);
  };

  // 🔹 Delete (DCP only)
  const handleDelete = (id) => {
    setOfficers((prev) => prev.filter((o) => o.id !== id));
  };

  // 🔐 role-based visibility
const visibleOfficers = officers.filter((o) => {
  if (user.role === "DCP") return true;

  if (user.role === "ACP") {
    return o.police_station === user.police_station;
  }

  if (user.role === "STATION_ADMIN") {
    return o.police_station === user.police_station;
  }

  return false;
});

  // 🔹 Search filter
  const filtered = visibleOfficers.filter(
  (o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.buckle_number.toLowerCase().includes(search.toLowerCase())
);


  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#0B3D91]">
          Officers Management
        </h1>
{canAddOfficer && (
  <button
    onClick={() => setShowForm(true)}
    className="bg-[#0B3D91] text-white px-4 py-2 rounded-md text-sm font-medium"
  >
    + Add Officer
  </button>
)}
      </div>

      {/* Search */}
      <input
        placeholder="Search by name or buckle..."
        className="mb-4 w-full md:w-80 p-2 border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0B3D91] text-white text-sm">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Buckle</th>
              <th>Rank</th>
              <th>Station</th>
              <th>Mobile</th>
              {user?.role === "DCP" && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50 text-sm">
                <td className="p-3 font-medium">{o.name}</td>
                <td>{o.buckle_number}</td>
                <td>{o.rank}</td>
                <td>{o.police_station}</td>
                <td>{o.mobile}</td>

                {user?.role === "DCP" && (
                  <td>
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No officers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 Slide Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-full p-6 shadow-xl overflow-y-auto">
            <h2 className="text-xl font-bold text-[#0B3D91] mb-4">
              Register Officer
            </h2>

            <form onSubmit={handleAddOfficer} className="space-y-3">
              <input
                required
                placeholder="Officer Name"
                className="w-full p-2 border rounded-lg"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                required
                placeholder="Buckle Number"
                className="w-full p-2 border rounded-lg"
                value={form.buckle_number}
                onChange={(e) =>
                  setForm({ ...form, buckle_number: e.target.value })
                }
              />

              <input
                required
                placeholder="Rank"
                className="w-full p-2 border rounded-lg"
                value={form.rank}
                onChange={(e) =>
                  setForm({ ...form, rank: e.target.value })
                }
              />

              <input
                required
                placeholder="Police Station"
                className="w-full p-2 border rounded-lg"
                value={form.police_station}
                onChange={(e) =>
                  setForm({
                    ...form,
                    police_station: e.target.value,
                  })
                }
              />

              <input
                required
                placeholder="Mobile Number"
                className="w-full p-2 border rounded-lg"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0B3D91] text-white py-2 rounded-md"
                >
                  Save Officer
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}