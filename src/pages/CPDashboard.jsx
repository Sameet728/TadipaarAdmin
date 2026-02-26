import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Administrator profile configuration
const currentAdmin = JSON.parse(localStorage.getItem("user")) || {
  role: "CP",
  name: "CP Pune",
};

// Mock data store for city-wide records
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

// Utility to calculate days since the last photo upload
const getPhotoPendingDays = (externee) => {
  if (!externee.photoUploadedAt) return "Not Uploaded";
  const today = new Date();
  const uploaded = new Date(externee.photoUploadedAt);
  return Math.floor((today - uploaded) / (1000 * 60 * 60 * 24));
};

// Reusable metrics card
const StatCard = ({ title, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
    <h2 className="text-3xl font-bold text-[#0B3D91] mt-2">{value}</h2>
  </div>
);

export default function CPDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const [zoneFilter, setZoneFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Extract unique zones for the filter dropdown
  const zoneOptions = useMemo(() => {
    const set = new Set(dummyExternees.map((e) => e.zone));
    return ["ALL", ...Array.from(set)];
  }, []);

  // Apply search and zone filters to the dataset
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

  // Aggregate metrics for the dashboard view
  const totalExternees = dummyExternees.length;
  const photoPending = dummyExternees.filter((e) => !e.photoUploadedAt);
  const violations = dummyExternees.filter((e) => e.enteredInOurArea);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header section */}
      <header className="bg-[#0B3D91] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl font-bold tracking-wide">
            Maharashtra Police | Tadipaar Monitoring System
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Commissioner Command Center
          </p>
        </div>

        <div className="flex flex-row gap-4 items-center flex-wrap">
          <span className="text-sm bg-white/10 px-4 py-1.5 rounded-md border border-white/20 font-medium w-fit">
            Officer: {currentAdmin.name}
          </span>

          {["CP", "DCP"].includes(currentAdmin.role) && (
            <button
              onClick={() => (window.location.href = "/add-externee")}
              className="bg-white text-[#0B3D91] border border-transparent px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Add New Record
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-white/30 bg-white/5 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-white hover:text-[#0B3D91] transition-colors duration-200"
          >
            Secure Logout
          </button>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="p-6 max-w-7xl mx-auto">
        
        {/* Violation alerts */}
        {violations.length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-700 text-red-800 px-5 py-4 rounded-r-md shadow-sm font-medium flex items-center">
            <span className="mr-2 font-bold">CRITICAL ALERT:</span> {violations.length} {violations.length === 1 ? 'externee has' : 'externees have'} breached restricted jurisdiction parameters across the city.
          </div>
        )}

        {/* Metrics summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total City Records" value={totalExternees} />
          <StatCard title="Photographs Pending" value={photoPending.length} />
          <StatCard title="Jurisdiction Violations" value={violations.length} />
          <StatCard title="Active Zones Monitored" value={zoneOptions.length - 1} />
        </div>

        {/* Data control panel */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 md:items-center">
          <input
            type="text"
            placeholder="Search by externee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent"
          />

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
          >
            {zoneOptions.map((z) => (
              <option key={z} value={z}>
                {z === "ALL" ? "All Administrative Zones" : z}
              </option>
            ))}
          </select>
        </div>

        {/* Records table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              City-Wide Monitoring Roster
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4">Externee Name</th>
                  <th className="px-5 py-4">Zone</th>
                  <th className="px-5 py-4">Police Station</th>
                  <th className="px-5 py-4">Sections Applied</th>
                  <th className="px-5 py-4">Photograph Status</th>
                  <th className="px-5 py-4">Jurisdiction Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-800">
                {filteredData.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-semibold">{e.name}</td>
                    <td className="px-5 py-4">{e.zone}</td>
                    <td className="px-5 py-4">{e.policeStation}</td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {e.externmentSections.join(", ")}
                    </td>
                    <td className="px-5 py-4">
                      {!e.photoUploadedAt ? (
                        <span className="text-red-700 font-semibold bg-red-50 px-2 py-1 rounded border border-red-200">
                          Pending Upload
                        </span>
                      ) : (
                        <span className="text-green-700 font-semibold">
                          Uploaded ({getPhotoPendingDays(e)} days ago)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {e.enteredInOurArea ? (
                        <span className="text-red-700 font-bold bg-red-50 px-3 py-1 rounded border border-red-300">
                          Violation Detected
                        </span>
                      ) : (
                        <span className="text-green-700 font-medium">
                          Compliant
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-8 text-center text-gray-500 font-medium">
                      No records found matching the current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}