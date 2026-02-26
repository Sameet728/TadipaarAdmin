import React, { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

/* =====================================================
   🔥 Logged in admin
===================================================== */

const currentAdmin = JSON.parse(localStorage.getItem("user")) || {
  role: "DCP",
  zone: "Zone-2",
  name: "DCP Pune",
};

/* =====================================================
   👤 DUMMY EXTERNEES
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
   🚔 DCP DASHBOARD
===================================================== */

export default function DCPDashboard() {
    const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/login", { replace: true });
};
  const [stationFilter, setStationFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  /* ================= ZONE FILTER ================= */

  const zoneExternees = useMemo(() => {
    return dummyExternees.filter(
      (e) => e.zone === currentAdmin.zone
    );
  }, []);

  /* ================= STATION LIST ================= */

  const stationOptions = useMemo(() => {
    const set = new Set(zoneExternees.map((e) => e.policeStation));
    return ["ALL", ...Array.from(set)];
  }, [zoneExternees]);

  /* ================= FILTER LOGIC ================= */

  const filteredExternees = useMemo(() => {
    let data = [...zoneExternees];

    if (sectionFilter !== "ALL") {
      data = data.filter((e) =>
        e.externmentSections.includes(Number(sectionFilter))
      );
    }

    if (stationFilter !== "ALL") {
      data = data.filter(
        (e) => e.policeStation === stationFilter
      );
    }

    if (search.trim()) {
      data = data.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [sectionFilter, stationFilter, search, zoneExternees]);

  /* ================= INTELLIGENCE METRICS ================= */

  const photoPending = zoneExternees.filter(
    (e) => !e.photoUploadedAt
  );

  const violations = zoneExternees.filter(
    (e) => e.enteredInOurArea
  );

  const stationBreakdown = useMemo(() => {
    const map = {};
    zoneExternees.forEach((e) => {
      map[e.policeStation] = (map[e.policeStation] || 0) + 1;
    });
    return map;
  }, [zoneExternees]);

  /* ===================================================== */

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* ================= NAVBAR ================= */}
      <div className="bg-[#0B3D91] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">
            Maharashtra Police • Tadipaar System
          </h1>
          <p className="text-blue-100 text-sm">
            DCP Zone Command
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
            className="
              flex items-center gap-2
              border border-white/40
              bg-white/10 backdrop-blur-sm
              text-white
              px-4 py-2
              rounded-lg
              text-sm font-medium
              hover:bg-white hover:text-[#0B3D91]
              transition-all duration-200
            "
          >
            Logout
          </button>
        </div>
        
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6">
        {/* 🚨 ALERT STRIP */}
        {violations.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium">
            🚨 {violations.length} externees have entered restricted area
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Zone Externees" value={zoneExternees.length} />
          <StatCard title="Photo Pending" value={photoPending.length} />
          <StatCard title="Area Violations" value={violations.length} />
          <StatCard title="Police Stations" value={stationOptions.length - 1} />
        </div>

        {/* STATION BREAKDOWN */}
        <div className="bg-white rounded-2xl border p-4 mb-6">
          <h2 className="font-semibold text-[#0B3D91] mb-3">
            📊 Station-wise Load
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stationBreakdown).map(([station, count]) => (
              <div key={station} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">{station}</p>
                <p className="text-xl font-bold text-[#0B3D91]">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl border mb-4 flex flex-col md:flex-row gap-3 md:items-center">
          <input
            placeholder="Search externee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-64"
          />

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="ALL">All Sections</option>
            <option value="55">Section 55</option>
            <option value="56">Section 56</option>
            <option value="57">Section 57</option>
          </select>

          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            {stationOptions.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Stations" : s}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-[#0B3D91]">
              📋 Zone Monitoring
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Police Station</th>
                  <th className="p-3 text-left">Sections</th>
                  <th className="p-3 text-left">Period</th>
                  <th className="p-3 text-left">Photo Status</th>
                  <th className="p-3 text-left">Area Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredExternees.map((e) => (
                  <tr key={e._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{e.name}</td>
                    <td className="p-3">{e.policeStation}</td>
                    <td className="p-3">
                      {e.externmentSections.join(", ")}
                    </td>
                    <td className="p-3">
                      {e.externmentFrom} → {e.externmentTill}
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

                {filteredExternees.length === 0 && (
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