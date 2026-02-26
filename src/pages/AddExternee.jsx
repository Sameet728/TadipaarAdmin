import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   🚔 Add Externee / Tadipaar Order
===================================================== */

export default function AddExternee() {
  const navigate = useNavigate();
  const currentAdmin = JSON.parse(localStorage.getItem("user")) || {};

  const [showToast, setShowToast] = useState(false);

  const [form, setForm] = useState({
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

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  /* ================= CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SECTION ================= */

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

  /* ================= HELPER ================= */

  const getDashboardByRole = (role) => {
    switch (role) {
      case "CP":
        return "/cp-dashboard";
      case "DCP":
        return "/dcp-dashboard";
      case "ACP":
        return "/acp-dashboard";
      default:
        return "/";
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("🚔 Tadipaar Order Data:", form);

    // ✅ show toast
    setShowToast(true);

    // reset form
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

    // ✅ redirect after short delay
    setTimeout(() => {
      navigate(getDashboardByRole(currentAdmin.role));
    }, 1200);
  };

  /* ===================================================== */

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* ================= NAVBAR ================= */}
      <div className="bg-[#0B3D91] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">
            Maharashtra Police • Tadipaar System
          </h1>
          <p className="text-blue-100 text-sm">Add Externee</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {currentAdmin?.name}
          </span>

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

      {/* ================= TOAST ================= */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50">
          ✅ Externee added successfully
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="p-4 md:p-6 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="
    w-full max-w-4xl
    bg-white
    rounded-2xl
    border border-gray-200
    shadow-sm
    p-5 md:p-8
  "
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B3D91] mb-6 flex items-center gap-2">
            <span className="text-3xl">➕</span>
            Tadipaar Order Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              name="policeStation"
              value={form.policeStation}
              onChange={handleChange}
              className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
"
              placeholder="Police Station"
            />

            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
"
              placeholder="Externee Name"
            />

            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
"
              placeholder="Mobile Number"
            />

            <input
              name="crimeType"
              value={form.crimeType}
              onChange={handleChange}
              className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
"
              placeholder="Crime Type"
            />
          </div>

          {/* Address */}
          <textarea
            required
            name="address"
            value={form.address}
            onChange={handleChange}
            className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
  mt-4
"
            placeholder="Address"
          />

          {/* Sections */}
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Externment Sections
            </p>

            <div className="flex flex-wrap gap-4">
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

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              required
              type="date"
              name="externmentFrom"
              value={form.externmentFrom}
              onChange={handleChange}
              className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
"
            />

            <input
              required
              type="date"
              name="externmentTill"
              value={form.externmentTill}
              onChange={handleChange}
              className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
"
            />
          </div>

          {/* Residence */}
          <textarea
            required
            name="externmentResidence"
            value={form.externmentResidence}
            onChange={handleChange}
            className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
  mt-4
"
            placeholder="Residence during externment"
          />

          {/* Photo */}
          <input
            type="file"
            accept="image/*"
            className="mt-4"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                photo: e.target.files[0],
              }))
            }
          />

          {/* Remarks */}
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="
  w-full
  border border-gray-300
  rounded-xl
  px-3 py-2.5
  text-sm
  focus:outline-none
  focus:ring-2 focus:ring-[#0B3D91]/30
  focus:border-[#0B3D91]
  transition
  mt-4
"
            placeholder="Remarks"
          />

          <button
            type="submit"
            className="
    mt-8
    w-full md:w-auto
    bg-[#0B3D91]
    text-white
    px-8 py-2.5
    rounded-xl
    font-semibold
    hover:bg-blue-900
    active:scale-[0.98]
    transition-all
    shadow-sm
  "
          >
            🚔 Create Tadipaar Order
          </button>
        </form>
      </div>
    </div>
  );
}
