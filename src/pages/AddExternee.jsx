import React, { useState } from "react";

/* =====================================================
   🚔 Add Externee / Tadipaar Order Form
===================================================== */

export default function AddExternee() {
  const [form, setForm] = useState({
    policeStation: "",
    name: "",
    address: "",
    externmentSections: [],
    externmentFrom: "",
    externmentTill: "",
    externmentResidence: "",
    photo: null,

    // 🔥 useful extra fields (recommended)
    crimeType: "",
    mobile: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SECTION MULTISELECT ================= */

  const handleSectionChange = (section) => {
    setForm((prev) => {
      const exists = prev.externmentSections.includes(section);

      return {
        ...prev,
        externmentSections: exists
          ? prev.externmentSections.filter((s) => s !== section)
          : [...prev.externmentSections, section],
      };
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("🚔 Tadipaar Order Data:", form);

    alert("Externee added (dummy)");

    // reset
    setForm({
      policeStation: "",
      name: "",
      address: "",
      externmentSections: [],
      externmentFrom: "",
      externmentTill: "",
      externmentResidence: "",
      photo: null,
      crimeType: "",
      mobile: "",
      remarks: "",
    });
  };

  /* ===================================================== */

  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0B3D91]">
          ➕ Add Externee / Tadipaar Order
        </h1>
        <p className="text-gray-600">
          Police Station Level Entry
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border shadow-sm p-6 max-w-4xl"
      >
        <div className="grid md:grid-cols-2 gap-4">
          {/* Police Station */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Police Station *
            </label>
            <input
              required
              name="policeStation"
              value={form.policeStation}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="e.g. Wakad PS"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Name of Externee *
            </label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Mobile (extra useful) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Number
            </label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Crime Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Crime Type
            </label>
            <input
              name="crimeType"
              value={form.crimeType}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="e.g. Robbery"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Address *
          </label>
          <textarea
            required
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows={2}
          />
        </div>

        {/* ================= EXTERNMENT SECTION ================= */}

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            Externment Sections *
          </label>

          <div className="flex gap-4">
            {[55, 56, 57].map((sec) => (
              <label key={sec} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.externmentSections.includes(sec)}
                  onChange={() => handleSectionChange(sec)}
                />
                Section {sec}
              </label>
            ))}
          </div>
        </div>

        {/* ================= PERIOD ================= */}

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Externment From *
            </label>
            <input
              required
              type="date"
              name="externmentFrom"
              value={form.externmentFrom}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Externment Till *
            </label>
            <input
              required
              type="date"
              name="externmentTill"
              value={form.externmentTill}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Residence during externment */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Address during externment *
          </label>
          <textarea
            required
            name="externmentResidence"
            value={form.externmentResidence}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows={2}
          />
        </div>

        {/* Photo upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Photo Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                photo: e.target.files[0],
              }))
            }
          />
        </div>

        {/* Remarks */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows={2}
          />
        </div>

        {/* Submit */}
        <button className="mt-6 bg-[#0B3D91] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900">
          🚔 Create Tadipaar Order
        </button>
      </form>
    </div>
  );
}