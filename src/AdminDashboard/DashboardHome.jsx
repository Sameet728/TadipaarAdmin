import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [criminals, setCriminals] = useState([]);
  const [logs, setLogs] = useState([]);

  /* ================= LOAD + SEED ================= */

  useEffect(() => {
    // 🔹 criminals
    let storedCriminals = JSON.parse(localStorage.getItem("criminals") || "[]");

    if (storedCriminals.length === 0) {
      storedCriminals = [
        {
          id: 1,
          name: "Ramesh Kale",
          aadhaar: "1234-5678-9012",
          from_area: "Swargate Bus Stand",
          police_station: "Swargate",
          start_date: "2026-01-01",
          end_date: "2026-06-01",
        },
        {
          id: 2,
          name: "Suresh More",
          aadhaar: "2222-3333-4444",
          from_area: "Shivajinagar Court",
          police_station: "Shivajinagar",
          start_date: "2025-12-01",
          end_date: "2026-02-15",
        },
        {
          id: 3,
          name: "Amit Jadhav",
          aadhaar: "9999-8888-7777",
          from_area: "Hadapsar Industrial Area",
          police_station: "Hadapsar",
          start_date: "2026-02-01",
          end_date: "2026-08-01",
        },
        {
          id: 4,
          name: "Vikas Pawar",
          aadhaar: "5555-6666-7777",
          from_area: "Swargate Bus Stand",
          police_station: "Swargate",
          start_date: "2025-10-01",
          end_date: "2025-12-01",
        },
      ];

      localStorage.setItem("criminals", JSON.stringify(storedCriminals));
    }

    // 🔹 logs
    let storedLogs = JSON.parse(localStorage.getItem("tadipaarLogs") || "[]");

    if (storedLogs.length === 0) {
      storedLogs = [
        {
          id: 1,
          police_station: "Swargate",
          is_violation: true,
        },
        {
          id: 2,
          police_station: "Shivajinagar",
          is_violation: false,
        },
        {
          id: 3,
          police_station: "Hadapsar",
          is_violation: true,
        },
      ];

      localStorage.setItem("tadipaarLogs", JSON.stringify(storedLogs));
    }

    setCriminals(storedCriminals);
    setLogs(storedLogs);
  }, []);

  /* ================= 🔐 ROLE-BASED DATA FILTER ================= */

  const scopedCriminals = useMemo(() => {
    if (!user) return [];

    if (user.role === "DCP") return criminals;

    // ACP & Station Admin → only their station
    return criminals.filter(
      (c) => c.police_station === user.police_station
    );
  }, [criminals, user]);

  const scopedLogs = useMemo(() => {
    if (!user) return [];

    if (user.role === "DCP") return logs;

    return logs.filter(
      (l) => l.police_station === user.police_station
    );
  }, [logs, user]);

  /* ================= HELPERS ================= */

  const isActive = (endDate) => new Date(endDate) >= new Date();

  /* ================= STATS ================= */

  const activeCount = scopedCriminals.filter((c) =>
    isActive(c.end_date)
  ).length;

  const expiredCount = scopedCriminals.length - activeCount;

  const violationCount = scopedLogs.filter(
    (l) => l.is_violation
  ).length;

  /* ================= PIE DATA ================= */

  const pieData = [
    { name: "Active", value: activeCount },
    { name: "Expired", value: expiredCount },
  ];

  /* ================= AREA DATA ================= */

  const areaData = useMemo(() => {
    const map = {};
    scopedCriminals.forEach((c) => {
      map[c.from_area] = (map[c.from_area] || 0) + 1;
    });

    return Object.keys(map).map((k) => ({
      area: k,
      count: map[k],
    }));
  }, [scopedCriminals]);

  /* ================= UI ================= */

  const isLimited = user.role === "STATION_ADMIN";

  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B3D91]">
          Intelligence Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome, {user?.name} ({user?.role})
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Tadipaar" value={scopedCriminals.length} />
        <StatCard title="Active Orders" value={activeCount} />
        <StatCard title="Total Violations" value={violationCount} danger />
      </div>

      {/* 🔐 LIMITED VIEW FOR STATION ADMIN */}
      {isLimited ? (
        <div className="bg-white rounded-xl border p-6 text-sm text-gray-500">
          Limited analytics available for Station Admin.
        </div>
      ) : (
        /* FULL ANALYTICS FOR DCP & ACP */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">
              Order Status Distribution
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={90}>
                  <Cell fill="#dc2626" />
                  <Cell fill="#6b7280" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">
              Area-wise Tadipaar Count
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0B3D91" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENT ================= */

function StatCard({ title, value, danger }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-2xl font-bold mt-1 ${
          danger ? "text-red-700" : "text-[#0B3D91]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}