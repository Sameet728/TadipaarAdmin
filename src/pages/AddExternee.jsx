import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddExternee() {
  const navigate = useNavigate();
  
  // Retrieve current administrative session
  const currentAdmin = JSON.parse(localStorage.getItem("user")) || {};

  // Component state management
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

  // Authentication and session termination
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Standard input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Legal section toggle handler
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

  // Determine post-submission routing based on official rank
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

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Log data payload for backend integration
    console.log("Externment Order Payload:", form);

    // Trigger success notification
    setShowToast(true);

    // Reset form state
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

    // Reroute to the appropriate command dashboard after a short delay
    setTimeout(() => {
      navigate(getDashboardByRole(currentAdmin.role));
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header Section */}
      <header className="bg-[#0B3D91] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl font-bold tracking-wide">
            Maharashtra Police | Tadipaar Monitoring System
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Official Record Registration
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm bg-white/10 px-4 py-1.5 rounded-md border border-white/20 font-medium">
            Officer: {currentAdmin?.name || "Unknown"}
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-white/30 bg-white/5 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-white hover:text-[#0B3D91] transition-colors duration-200"
          >
            Secure Logout
          </button>
        </div>
      </header>

      {/* System Notification Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-700 border border-green-800 text-white px-6 py-3 rounded-md shadow-lg z-50 font-medium flex items-center">
          <span className="mr-2 font-bold">SUCCESS:</span> Externment record successfully registered.
        </div>
      )}

      {/* Main Content Area */}
      <main className="p-6 flex justify-center mt-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8"
        >
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
              Externment Order Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the legal and personal details of the subject for the official database.
            </p>
          </div>

          {/* Primary Details Grid */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Police Station</label>
              <input
                required
                name="policeStation"
                value={form.policeStation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                placeholder="e.g., Wakad PS"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Name</label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                placeholder="Full official name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                placeholder="Contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Crime Type</label>
              <input
                name="crimeType"
                value={form.crimeType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                placeholder="Nature of offenses"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Permanent/Current Address</label>
            <textarea
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
              placeholder="Enter complete address"
            />
          </div>

          {/* Legal Sections */}
          <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Applicable Legal Sections (Externment)
            </p>
            <div className="flex flex-wrap gap-6">
              {[55, 56, 57].map((sec) => (
                <label key={sec} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.externmentSections.includes(sec)}
                    onChange={() => handleSectionChange(sec)}
                    className="w-4 h-4 text-[#0B3D91] border-gray-300 rounded focus:ring-[#0B3D91]"
                  />
                  <span className="text-sm font-medium text-gray-700">Section {sec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Duration */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Active From Date</label>
              <input
                required
                type="date"
                name="externmentFrom"
                value={form.externmentFrom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Active Until Date</label>
              <input
                required
                type="date"
                name="externmentTill"
                value={form.externmentTill}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all text-gray-700"
              />
            </div>
          </div>

          {/* Externment Residence */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mandated Residence During Externment</label>
            <textarea
              required
              name="externmentResidence"
              value={form.externmentResidence}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
              placeholder="Specified location the subject must reside in"
            />
          </div>

          {/* File Upload */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Photograph</label>
            <div className="border border-dashed border-gray-300 rounded-md p-3 bg-gray-50 flex items-center">
              <input
                type="file"
                accept="image/*"
                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0B3D91] file:text-white hover:file:bg-blue-800 transition-all cursor-pointer w-full"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    photo: e.target.files[0],
                  }))
                }
              />
            </div>
          </div>

          {/* Additional Remarks */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Official Remarks / Case Notes</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
              placeholder="Any additional instructions or behavioral notes"
            />
          </div>

          {/* Submit Action */}
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#0B3D91] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#082a66] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3D91] transition-all shadow-sm"
            >
              Submit Official Record
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}