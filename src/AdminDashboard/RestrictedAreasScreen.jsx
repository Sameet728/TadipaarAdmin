import React, { useEffect, useMemo, useState } from "react";
import LocationPickerMap from "../components/LocationPickerMap";

export default function RestrictedAreasScreen() {
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= DEFAULT SEED ================= */

  const defaultAreas = [
    {
      id: 1,
      name: "Swargate Bus Stand",
      police_station: "Swargate",
      latitude: 18.5018,
      longitude: 73.8636,
      radius: 500,
    },
    {
      id: 2,
      name: "Shivajinagar Court",
      police_station: "Shivajinagar",
      latitude: 18.5308,
      longitude: 73.8475,
      radius: 300,
    },
    {
      id: 3,
      name: "Hadapsar Industrial Area",
      police_station: "Hadapsar",
      latitude: 18.5089,
      longitude: 73.926,
      radius: 700,
    },
  ];

  const [areas, setAreas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [mapPosition, setMapPosition] = useState(null);

  const [form, setForm] = useState({
    name: "",
    police_station: user?.police_station || "",
    latitude: "",
    longitude: "",
    radius: "",
  });

  /* ================= LOAD AREAS ================= */

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("restrictedAreas") || "[]");

    if (stored.length === 0) {
      stored = defaultAreas;
      localStorage.setItem("restrictedAreas", JSON.stringify(stored));
    }

    setAreas(stored);
  }, []);

  /* ================= MAP AUTO FILL ================= */

  useEffect(() => {
    if (mapPosition) {
      setForm((prev) => ({
        ...prev,
        latitude: mapPosition.lat.toFixed(6),
        longitude: mapPosition.lng.toFixed(6),
      }));
    }
  }, [mapPosition]);

  /* ================= 🔐 ROLE FILTER ================= */

  const visibleAreas = useMemo(() => {
    if (!user) return [];

    if (user.role === "DCP") return areas;

    // ACP & Station Admin → only their station
    return areas.filter(
      (a) => a.police_station === user.police_station
    );
  }, [areas, user]);

  /* ================= ACTIONS ================= */

  const openInGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const handleAddArea = (e) => {
    e.preventDefault();

    const newArea = {
      id: Date.now(),
      ...form,
      police_station: user.police_station, // 🔥 force correct jurisdiction
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      radius: Number(form.radius),
    };

    const updated = [newArea, ...areas];
    setAreas(updated);
    localStorage.setItem("restrictedAreas", JSON.stringify(updated));

    setForm({
      name: "",
      police_station: user.police_station,
      latitude: "",
      longitude: "",
      radius: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = areas.filter((a) => a.id !== id);
    setAreas(updated);
    localStorage.setItem("restrictedAreas", JSON.stringify(updated));
  };

  /* ================= PERMISSIONS ================= */

  const canDelete = user?.role === "DCP";
  const canAdd = ["DCP", "ACP"].includes(user?.role);

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#0B3D91]">
          Restricted Areas
        </h1>

        {canAdd && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#0B3D91] text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Add Area
          </button>
        )}
      </div>

      {/* Areas list */}
      <div className="grid gap-4">
        {visibleAreas.map((a) => (
          <div
            key={a.id}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{a.name}</p>

                <p className="text-sm text-gray-500">
                  Station: {a.police_station}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {a.latitude}, {a.longitude}
                </p>

                <p className="text-sm text-gray-500">
                  Radius: {a.radius} meters
                </p>

                <button
                  onClick={() =>
                    openInGoogleMaps(a.latitude, a.longitude)
                  }
                  className="mt-2 text-sm px-3 py-1 rounded-md border border-[#0B3D91] text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white transition"
                >
                  View on Google Maps
                </button>
              </div>

              {canDelete && (
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-600 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

        {visibleAreas.length === 0 && (
          <div className="text-center text-gray-500 p-6">
            No restricted areas found
          </div>
        )}
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-full p-6 shadow-xl overflow-y-auto">
            <h2 className="text-xl font-bold text-[#0B3D91] mb-4">
              Add Restricted Area
            </h2>

            <form onSubmit={handleAddArea} className="space-y-3">
              <input
                required
                placeholder="Area Name"
                className="w-full p-2 border rounded-lg"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              {/* Map */}
              <LocationPickerMap
                position={mapPosition}
                setPosition={setMapPosition}
              />

              <input
                required
                type="number"
                step="any"
                placeholder="Latitude"
                className="w-full p-2 border rounded-lg"
                value={form.latitude}
                onChange={(e) =>
                  setForm({ ...form, latitude: e.target.value })
                }
              />

              <input
                required
                type="number"
                step="any"
                placeholder="Longitude"
                className="w-full p-2 border rounded-lg"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
              />

              <input
                required
                type="number"
                placeholder="Radius (meters)"
                className="w-full p-2 border rounded-lg"
                value={form.radius}
                onChange={(e) =>
                  setForm({ ...form, radius: e.target.value })
                }
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0B3D91] text-white py-2 rounded-md"
                >
                  Save Area
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