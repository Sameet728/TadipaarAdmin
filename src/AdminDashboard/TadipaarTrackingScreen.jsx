import React, { useEffect, useState } from "react";

export default function TadipaarTrackingScreen() {
  const [logs, setLogs] = useState([]);

  const openInGoogleMaps = (lat, lng) => {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, "_blank");
};

  // 🔹 dummy data for now
  useEffect(() => {
    setLogs([
      {
        id: 1,
        name: "Ramesh Kale",
        aadhaar: "1234-5678-9012",
        image_url:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        latitude: 18.5204,
        longitude: 73.8567,
        police_station: "Shivajinagar",
        is_violation: true,
        captured_at: "2026-02-24 14:30",
      },
      {
        id: 2,
        name: "Suresh More",
        aadhaar: "9876-5432-1111",
        image_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        latitude: 18.531,
        longitude: 73.844,
        police_station: "Hadapsar",
        is_violation: false,
        captured_at: "2026-02-24 12:10",
      },
    ]);
  }, []);

  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0B3D91] mb-6">
        Tadipaar Monitoring
      </h1>

      <div className="grid gap-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-xl shadow-sm border p-4 flex gap-4"
          >
            {/* Photo */}
            <img
              src={log.image_url}
              alt="evidence"
              className="w-24 h-24 object-cover rounded-lg border"
            />

            {/* Details */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
  {/* LEFT */}
  <div className="flex-1 flex flex-row justify-between">
    <div>
    <p className="font-semibold text-gray-800 text-lg">
      {log.name}
    </p>

    <p className="text-sm text-gray-500">
      Aadhaar: <span className="font-medium">{log.aadhaar}</span>
    </p>

    <p className="text-sm text-gray-500 mt-1">
      📍 {log.latitude}, {log.longitude}
    </p>

    <p className="text-sm text-gray-500">
      🏢 {log.police_station}
    </p>

    <p className="text-sm text-gray-500">
      ⏱ {log.captured_at}
    </p>
    </div>
<div>

    {/* 🔥 VIEW MAP BUTTON */}
    <button
      onClick={() =>
        openInGoogleMaps(log.latitude, log.longitude)
      }
      className="mt-2 text-sm px-3 py-1 rounded-md border border-[#0B3D91] text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white transition"
    >
      View Location
    </button>
</div>
    
  </div>

  {/* STATUS */}
  <div className="ml-4">
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        log.is_violation
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {log.is_violation ? "Violation" : "Within Area"}
    </span>
  </div>
</div>

             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}