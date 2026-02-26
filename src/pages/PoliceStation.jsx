
import React from "react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   🔥 TEMP DUMMY IMPORTS
===================================================== */

// 🚔 Active logged-in admin
const currentAdmin = {
  _id: "A4",
  name: "PSI Wakad",
  role: "PSI",
  zone: "Zone-2",
  policeStation: "Wakad PS",
};

// 👤 Externees dummy
const dummyExternees = [
  {
    _id: "EX1",
    name: "Ramesh Pawar",
    address: "Shivaji Nagar, Pune",
    policeStation: "Wakad PS",
    zone: "Zone-2",
    externmentSections: [55, 56],
    externmentFrom: "2026-02-01",
    externmentTill: "2026-06-01",
    externmentResidence: "Satara, Maharashtra",
    photoUrl: "https://via.placeholder.com/100",
    photoUploadedAt: "2026-02-10",
    enteredInOurArea: false,
  },
  {
    _id: "EX2",
    name: "Suresh Shinde",
    address: "Bhosari MIDC, Pune",
    policeStation: "Wakad PS",
    zone: "Zone-2",
    externmentSections: [57],
    externmentFrom: "2026-01-15",
    externmentTill: "2026-05-15",
    externmentResidence: "Solapur, Maharashtra",
    photoUrl: "",
    photoUploadedAt: null,
    enteredInOurArea: true,
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
   🚔 POLICE STATION DASHBOARD
===================================================== */

const PoliceStation = () => {
    const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/login", { replace: true });
};
  const station = currentAdmin.policeStation;

  const stationExternees = dummyExternees.filter(
    (e) => e.policeStation === station
  );

  const photoPending = stationExternees.filter(
    (e) => !e.photoUploadedAt
  );

  const violations = stationExternees.filter(
    (e) => e.enteredInOurArea
  );

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* ================= NAVBAR ================= */}
     {/* ================= NAVBAR ================= */}
<div className="bg-[#0B3D91] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  
  {/* LEFT */}
  <div>
    <h1 className="text-xl font-bold">
      Maharashtra Police • Tadipaar System
    </h1>
    <p className="text-blue-100 text-sm">
      Police Station Monitoring
    </p>
  </div>

  {/* RIGHT */}
  <div className="flex items-center gap-3">
    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
      {currentAdmin.name}
    </span>

    <button
  onClick={handleLogout}
  className="
    flex items-center gap-2
    bg-white text-[#0B3D91]
    px-4 py-2
    rounded-xl
    font-semibold text-sm
    shadow-sm
    hover:bg-gray-100 hover:shadow
    active:scale-95
    transition-all duration-200
  "
>
  <span className="text-base">🚪</span>
  <span className="hidden sm:inline">Logout</span>
</button>
  </div>
</div>

      {/* ================= CONTENT ================= */}
      <div className="p-6">
        {/* 🚨 ALERT STRIP */}
        {violations.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium">
            🚨 {violations.length} externees entered your jurisdiction
          </div>
        )}

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Externees" value={stationExternees.length} />
          <StatCard title="Photo Pending" value={photoPending.length} />
          <StatCard title="Area Violations" value={violations.length} />
          <StatCard title="Active Sections" value="55 / 56 / 57" />
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-[#0B3D91]">
              📋 Externee List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Photo</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Sections</th>
                  <th className="p-3 text-left">Period</th>
                  <th className="p-3 text-left">Photo Pending</th>
                  <th className="p-3 text-left">Area Status</th>
                </tr>
              </thead>

              <tbody>
                {stationExternees.map((e) => (
                  <tr key={e._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {e.photoUrl ? (
                        <img
                          src={e.photoUrl}
                          alt="externee"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <span className="text-red-600 font-medium">
                          ❌ Not Uploaded
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-medium">{e.name}</td>

                    <td className="p-3">
                      {e.externmentSections.join(", ")}
                    </td>

                    <td className="p-3">
                      {e.externmentFrom} → {e.externmentTill}
                    </td>

                    <td className="p-3">{getPhotoPendingDays(e)}</td>

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

                {stationExternees.length === 0 && (
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
};

export default PoliceStation;