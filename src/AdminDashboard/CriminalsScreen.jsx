    import React, { useEffect, useState } from "react";

    export default function CriminalsScreen() {
    const user = JSON.parse(localStorage.getItem("user"));
    const canAddCriminal = ["DCP", "ACP"].includes(user?.role);

    /* ================= AREAS ================= */

    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("restrictedAreas");
        setAreas(stored ? JSON.parse(stored) : []);
    }, []);

    /* ================= CRIMINALS ================= */

    const [criminals, setCriminals] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("criminals") || "[]");
        setCriminals(stored);
    }, []);

    /* ================= FORM STATE ================= */

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        aadhaar: "",
        from_area: "",
        start_date: "",
        end_date: "",
    });

    /* ================= HELPERS ================= */

    const isActive = (endDate) => {
        return new Date(endDate) >= new Date();
    };

    /* ================= 🔐 ROLE FILTER (VERY IMPORTANT) ================= */

    const visibleCriminals = criminals.filter((c) => {
        if (!user) return false;

        // ✅ DCP sees all
        if (user.role === "DCP") return true;

        // ✅ ACP → same station/zone
        if (user.role === "ACP") {
        return c.police_station === user.police_station;
        }

        // ✅ Station Admin → only their station
        if (user.role === "STATION_ADMIN") {
        return c.police_station === user.police_station;
        }

        return false;
    });

    /* ================= SEARCH FILTER ================= */

    const filtered = visibleCriminals.filter(
        (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.aadhaar.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= ADD CRIMINAL ================= */

    const handleAddCriminal = (e) => {
        e.preventDefault();
          if (!canAddCriminal) return; // 🔐 security guard

        const newCriminal = {
        id: Date.now(),
        ...form,
        police_station: user.police_station, // 🔥 CRITICAL FOR RBAC
        created_by: user.name,
        created_role: user.role,
        };

        const updated = [newCriminal, ...criminals];

        setCriminals(updated);
        localStorage.setItem("criminals", JSON.stringify(updated));

        setForm({
        name: "",
        aadhaar: "",
        from_area: "",
        start_date: "",
        end_date: "",
        });

        setShowForm(false);
    };

    /* ================= UI ================= */

    return (
        <div className="p-6 bg-[#F4F6F9] min-h-screen">
        {/* Header */}
        <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#0B3D91]">
            Externed Persons
            </h1>

            {canAddCriminal && (
  <button
    onClick={() => setShowForm(true)}
    className="bg-[#0B3D91] text-white px-4 py-2 rounded-lg text-sm font-medium"
  >
    + Add Record
  </button>
)}
        </div>

        {/* Search */}
        <input
            placeholder="Search by name or Aadhaar..."
            className="mb-4 w-full md:w-80 p-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        {/* List */}
        <div className="grid gap-4">
            {filtered.map((c) => {
            const active = isActive(c.end_date);

            return (
                <div
                key={c.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-5"
                >
                <div className="flex justify-between items-start">
                    {/* LEFT */}
                    <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-lg">
                        {c.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        Aadhaar:{" "}
                        <span className="font-medium">{c.aadhaar}</span>
                    </p>

                    <p className="text-sm text-gray-500">
                        Tadipaar From:{" "}
                        <span className="font-medium">{c.from_area}</span>
                    </p>

                    <p className="text-sm text-gray-400">
                        Station: {c.police_station}
                    </p>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="bg-gray-50 rounded-lg p-2 border">
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm font-medium text-gray-800">
                            {c.start_date}
                        </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-2 border">
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium text-gray-800">
                            {c.end_date}
                        </p>
                        </div>
                    </div>
                    </div>

                    {/* Status */}
                    <div className="ml-4">
                    <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                        active
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                    >
                        {active ? "Active" : "Expired"}
                    </span>
                    </div>
                </div>
                </div>
            );
            })}

            {filtered.length === 0 && (
            <div className="text-center text-gray-500 p-6">
                No records found
            </div>
            )}
        </div>

        {/* ================= SLIDE FORM ================= */}
        {showForm && (
            <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
            <div className="w-full max-w-md bg-white h-full p-6 shadow-xl overflow-y-auto">
                <h2 className="text-xl font-bold text-[#0B3D91] mb-4">
                Add Tadipaar Record
                </h2>

                <form onSubmit={handleAddCriminal} className="space-y-3">
                <input
                    required
                    placeholder="Full Name"
                    className="w-full p-2 border rounded-lg"
                    value={form.name}
                    onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    required
                    placeholder="Aadhaar Number"
                    className="w-full p-2 border rounded-lg"
                    value={form.aadhaar}
                    onChange={(e) =>
                    setForm({ ...form, aadhaar: e.target.value })
                    }
                />

                <select
                    required
                    className="w-full p-2 border rounded-lg"
                    value={form.from_area}
                    onChange={(e) =>
                    setForm({ ...form, from_area: e.target.value })
                    }
                >
                    <option value="">Select Tadipaar Area</option>
                    {areas.map((a) => (
                    <option key={a.id} value={a.name}>
                        {a.name}
                    </option>
                    ))}
                </select>

                <div>
                    <label className="text-sm text-gray-600">
                    Start Date
                    </label>
                    <input
                    required
                    type="date"
                    className="w-full p-2 border rounded-lg"
                    value={form.start_date}
                    onChange={(e) =>
                        setForm({ ...form, start_date: e.target.value })
                    }
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">
                    End Date
                    </label>
                    <input
                    required
                    type="date"
                    className="w-full p-2 border rounded-lg"
                    value={form.end_date}
                    onChange={(e) =>
                        setForm({ ...form, end_date: e.target.value })
                    }
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                    type="submit"
                    className="flex-1 bg-[#0B3D91] text-white py-2 rounded-md"
                    >
                    Save Record
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