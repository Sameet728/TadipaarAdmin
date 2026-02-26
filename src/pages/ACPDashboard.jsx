import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   Logged In Administrator Data
===================================================== */

const currentAdmin = JSON.parse(localStorage.getItem("user")) || {
  role: "ACP",
  zone: "Zone-2",
  name: "ACP Wakad",
};

/* =====================================================
   Dummy Externees Database
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
   Utility Functions
===================================================== */

const getPhotoPendingDays = (externee) => {
  if (!externee.photoUploadedAt) return "Not Uploaded";
  const today = new Date();
  const uploaded = new Date(externee.photoUploadedAt);
  return Math.floor((today - uploaded) / (1000 * 60 * 60 * 24));
};

const StatCard = ({ title, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
    <h2 className="text-3xl font-bold text-[#0B3D91] mt-2">{value}</h2>
  </div>
);

/* =====================================================
   ACP Dashboard Component
===================================================== */

export default function ACPDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [stationFilter, setStationFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  /* ================= Zone Filter ================= */

  const zoneExternees = useMemo(() => {
    return dummyExternees.filter((e) => e.zone === currentAdmin.zone);
  }, []);

  /* ================= Station Options ================= */

  const stationOptions = useMemo(() => {
    const set = new Set(zoneExternees.map((e) => e.policeStation));
    return ["ALL", ...Array.from(set)];
  }, [zoneExternees]);

  /* ================= Filter Logic ================= */

  const filteredExternees = useMemo(() => {
    let data = [...zoneExternees];

    if (sectionFilter !== "ALL") {
      data = data.filter((e) =>
        e.externmentSections.includes(Number(sectionFilter))
      );
    }

    if (stationFilter !== "ALL") {
      data = data.filter((e) => e.policeStation === stationFilter);
    }

    if (search.trim()) {
      data = data.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [sectionFilter, stationFilter, search, zoneExternees]);

  const photoPending = zoneExternees.filter((e) => !e.photoUploadedAt);
  const violations = zoneExternees.filter((e) => e.enteredInOurArea);

  /* ===================================================== */

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ================= Navbar ================= */}
      <header className="bg-[#0B3D91] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl font-bold tracking-wide">
            Maharashtra Police | Tadipaar Monitoring System
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            ACP Sub-Division Operational Dashboard
          </p>
        </div>

        <div className="flex flex-row gap-6 items-center">
          <span className="text-sm bg-white/10 px-4 py-1.5 rounded-md border border-white/20 font-medium w-fit">
            Officer: {currentAdmin.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-white/30 bg-white/5 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-white hover:text-[#0B3D91] transition-colors duration-200"
          >
            Secure Logout
          </button>
        </div>
      </header>

      {/* ================= Main Content ================= */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Alert Banner */}
        {violations.length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-700 text-red-800 px-5 py-4 rounded-r-md shadow-sm font-medium flex items-center">
            <span className="mr-2 font-bold">ATTENTION:</span> {violations.length} {violations.length === 1 ? 'externee has' : 'externees have'} breached restricted jurisdiction parameters. Immediate action required.
          </div>
        )}

        {/* ================= Key Statistics ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Zone Externees" value={zoneExternees.length} />
          <StatCard title="Photographs Pending" value={photoPending.length} />
          <StatCard title="Jurisdiction Violations" value={violations.length} />
          <StatCard title="Active Filter Results" value={filteredExternees.length} />
        </div>

        {/* ================= Control Panel / Filters ================= */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 md:items-center">
          <input
            type="text"
            placeholder="Search by externee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent"
          />

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
          >
            <option value="ALL">All Legal Sections</option>
            <option value="55">Section 55</option>
            <option value="56">Section 56</option>
            <option value="57">Section 57</option>
          </select>

          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
          >
            {stationOptions.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Police Stations" : s}
              </option>
            ))}
          </select>
        </div>

        {/* ================= Data Table ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              Externee Monitoring Roster
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4">Externee Name</th>
                  <th className="px-5 py-4">Police Station</th>
                  <th className="px-5 py-4">Sections Applied</th>
                  <th className="px-5 py-4">Active Period</th>
                  <th className="px-5 py-4">Photograph Status</th>
                  <th className="px-5 py-4">Jurisdiction Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-800">
                {filteredExternees.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-semibold">{e.name}</td>
                    <td className="px-5 py-4">{e.policeStation}</td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {e.externmentSections.join(", ")}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {e.externmentFrom} <span className="mx-1">to</span> {e.externmentTill}
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

                {filteredExternees.length === 0 && (
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