import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   👑 Logged in CP
===================================================== */

const currentAdmin = JSON.parse(localStorage.getItem("user")) || {
  role: "CP",
  name: "CP Pune",
};

/* =====================================================
   👤 CITY-WIDE DUMMY EXTERNEES
===================================================== */

const dummyExternees = [
  {
    _id: "EX1",
    name: "Ramesh Pawar",
    policeStation: "Wakad PS",
    zone: "Zone-2",
    externmentSections: [55, 56],
    externmentFrom: "2026-02-01",
    externmentTill: "2026-06-01",
    photoUploadedAt: "2026-02-10",
    enteredInOurArea: false,
  },
  {
    _id: "EX2",
    name: "Suresh Shinde",
    policeStation: "Hinjewadi PS",
    zone: "Zone-2",
    externmentSections: [57],
    externmentFrom: "2026-01-15",
    externmentTill: "2026-05-15",
    photoUploadedAt: null,
    enteredInOurArea: true,
  },
  {
    _id: "EX3",
    name: "Akash More",
    policeStation: "Nigdi PS",
    zone: "Zone-1",
    externmentSections: [55],
    externmentFrom: "2026-02-05",
    externmentTill: "2026-08-05",
    photoUploadedAt: "2026-02-06",
    enteredInOurArea: false,
  },
];

/* =====================================================
   🧮 HELPERS
===================================================== */

const getPhotoPendingDays = (externee) => {
  if (!externee.photoUploadedAt) return "Not Uploaded";
  const today = new Date();
  const uploaded = new Date(externee.photoUploadedAt);
  return Math.floor((today - uploaded) / (1000 * 60 * 60 * 24));
};

const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-3xl font-bold text-[#0B3D91] mt-1">{value}</h2>
  </div>
);

/* =====================================================
   👑 CP DASHBOARD
===================================================== */

export default function CPDashboard() {
    const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/login", { replace: true });
};
  const [zoneFilter, setZoneFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  /* ================= ZONE OPTIONS ================= */

  const zoneOptions = useMemo(() => {
    const set = new Set(dummyExternees.map((e) => e.zone));
    return ["ALL", ...Array.from(set)];
  }, []);

  /* ================= FILTERED DATA ================= */

  const filteredData = useMemo(() => {
    let data = [...dummyExternees];

    if (zoneFilter !== "ALL") {
      data = data.filter((e) => e.zone === zoneFilter);
    }

    if (search.trim()) {
      data = data.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [zoneFilter, search]);

  /* ================= INTELLIGENCE ================= */

  const totalExternees = dummyExternees.length;
  const photoPending = dummyExternees.filter((e) => !e.photoUploadedAt);
  const violations = dummyExternees.filter((e) => e.enteredInOurArea);

  /* ================================================= */

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* ================= NAVBAR ================= */}
      <div className="bg-[#0B3D91] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">
            Maharashtra Police • Tadipaar System
          </h1>
          <p className="text-blue-100 text-sm">
            Commissioner Command Center
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {currentAdmin.name}
          </span>

          {["CP", "DCP"].includes(currentAdmin.role) && (
            <button
              onClick={() => (window.location.href = "/add-externee")}
              className="bg-white text-[#0B3D91] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              ➕ Add Externee
            </button>
          )}
          <button
      onClick={handleLogout}
      className="bg-white text-[#0B3D91] px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition"
    >
      🚪 Logout
    </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="City Externees" value={totalExternees} />
          <StatCard title="Photo Pending" value={photoPending.length} />
          <StatCard title="Area Violations" value={violations.length} />
          <StatCard title="Active Zones" value={zoneOptions.length - 1} />
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl border mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            placeholder="Search externee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-64"
          />

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-48"
          >
            {zoneOptions.map((z) => (
              <option key={z} value={z}>
                {z === "ALL" ? "All Zones" : z}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-[#0B3D91]">
              📋 City Monitoring
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Zone</th>
                  <th className="p-3 text-left">Police Station</th>
                  <th className="p-3 text-left">Sections</th>
                  <th className="p-3 text-left">Photo Status</th>
                  <th className="p-3 text-left">Area Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((e) => (
                  <tr key={e._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{e.name}</td>
                    <td className="p-3">{e.zone}</td>
                    <td className="p-3">{e.policeStation}</td>
                    <td className="p-3">
                      {e.externmentSections.join(", ")}
                    </td>
                    <td className="p-3">
                      {!e.photoUploadedAt ? (
                        <span className="text-red-600 font-semibold">
                          ❌ Not Uploaded
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          ✅ {getPhotoPendingDays(e)} days
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {e.enteredInOurArea ? (
                        <span className="text-red-600 font-semibold">
                          🚨 Violation
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          ✅ OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No externees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}