import React from "react";
import { useNavigate } from "react-router-dom";

// Active administrative session configuration
const currentAdmin = {
  _id: "A4",
  name: "PSI Wakad",
  role: "PSI",
  zone: "Zone-2",
  policeStation: "Wakad PS",
};

// Mock database for jurisdictional records
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

const PoliceStation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const station = currentAdmin.policeStation;

  // Filter records specifically for the logged-in officer's station
  const stationExternees = dummyExternees.filter(
    (e) => e.policeStation === station
  );

  // Aggregate metrics for the dashboard view
  const photoPending = stationExternees.filter((e) => !e.photoUploadedAt);
  const violations = stationExternees.filter((e) => e.enteredInOurArea);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header section */}
      <header className="bg-[#0B3D91] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl font-bold tracking-wide">
            Maharashtra Police | Tadipaar Monitoring System
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Station Level Operational Dashboard
          </p>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <span className="text-sm bg-white/10 px-4 py-1.5 rounded-md border border-white/20 font-medium w-fit">
            Officer: {currentAdmin.name} ({currentAdmin.policeStation})
          </span>

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
            <span className="mr-2 font-bold">CRITICAL ALERT:</span> {violations.length} {violations.length === 1 ? 'externee has' : 'externees have'} breached restricted jurisdiction parameters within your station limits. Action required.
          </div>
        )}

        {/* Metrics summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Station Records" value={stationExternees.length} />
          <StatCard title="Photographs Pending" value={photoPending.length} />
          <StatCard title="Jurisdiction Violations" value={violations.length} />
          <StatCard title="Active Legal Sections" value="55 / 56 / 57" />
        </div>

        {/* Records table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              Jurisdictional Monitoring Roster
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4">Photograph</th>
                  <th className="px-5 py-4">Externee Name</th>
                  <th className="px-5 py-4">Sections Applied</th>
                  <th className="px-5 py-4">Active Period</th>
                  <th className="px-5 py-4">Upload Status</th>
                  <th className="px-5 py-4">Jurisdiction Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-800">
                {stationExternees.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      {e.photoUrl ? (
                        <img
                          src={e.photoUrl}
                          alt="Subject profile"
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-bold text-xs">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold">{e.name}</td>

                    <td className="px-5 py-4 font-mono text-xs">
                      {e.externmentSections.join(", ")}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {e.externmentFrom} <span className="mx-1">to</span> {e.externmentTill}
                    </td>

                    <td className="px-5 py-4">
                      {!e.photoUploadedAt ? (
                        <span className="text-red-700 font-semibold bg-red-50 px-2 py-1 rounded border border-red-200 text-xs uppercase tracking-wide">
                          Action Required
                        </span>
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {getPhotoPendingDays(e)} days ago
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

                {stationExternees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-8 text-center text-gray-500 font-medium">
                      No records found for this jurisdiction.
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
};

export default PoliceStation;