// ===============================
// 🚔 ADMINS
// ===============================
export const dummyAdmins = [
  {
    _id: "A1",
    name: "DCP Pune",
    email: "dcp@pune.police",
    role: "DCP",
    zone: null,
    policeStation: null,
  },
  {
    _id: "A2",
    name: "ACP Shivajinagar",
    email: "acp.zone1@pune.police",
    role: "ACP",
    zone: "Zone-1",
    policeStation: null,
  },
  {
    _id: "A3",
    name: "PSI Wakad",
    email: "psi.wakad@pune.police",
    role: "PSI",
    zone: "Zone-1",
    policeStation: "Wakad Police Station",
  },
];

// 🔥 Active logged-in admin (change for testing)
export const currentAdmin = dummyAdmins[0]; // change index 0/1/2

// ===============================
// 👤 CRIMINALS
// ===============================
export const dummyCriminals = [
  {
    _id: "C1",
    name: "Ramesh Pawar",
    age: 32,
    gender: "Male",
    phone: "9876543210",
    zone: "Zone-1",
    policeStation: "Wakad Police Station",
    loginId: "CR123456",
    status: "active",
  },
  {
    _id: "C2",
    name: "Suresh Shinde",
    age: 28,
    gender: "Male",
    phone: "9123456780",
    zone: "Zone-2",
    policeStation: "Hinjewadi Police Station",
    loginId: "CR654321",
    status: "active",
  },
  {
    _id: "C3",
    name: "Akash More",
    age: 35,
    gender: "Male",
    phone: "9988776655",
    zone: "Zone-1",
    policeStation: "Wakad Police Station",
    loginId: "CR789123",
    status: "active",
  },
];

// ===============================
// 📍 RESTRICTED AREAS
// ===============================
export const dummyAreas = [
  {
    _id: "AR1",
    areaName: "Shivaji Nagar",
    latitude: 18.5308,
    longitude: 73.8475,
    radiusKm: 5,
    zone: "Zone-1",
  },
  {
    _id: "AR2",
    areaName: "Hinjewadi Phase 1",
    latitude: 18.5912,
    longitude: 73.7389,
    radiusKm: 3,
    zone: "Zone-2",
  },
];

// ===============================
// 🚔 TADIPAAR ORDERS
// ===============================
export const dummyOrders = [
  {
    _id: "T1",
    criminalId: "C1",
    crimeType: "Robbery",
    startDate: "2026-02-01",
    endDate: "2026-06-01",
    restrictedAreaIds: ["AR1"],
    status: "active",
  },
  {
    _id: "T2",
    criminalId: "C2",
    crimeType: "Chain Snatching",
    startDate: "2026-01-15",
    endDate: "2026-05-15",
    restrictedAreaIds: ["AR2"],
    status: "active",
  },
];

// ===============================
// 📸 DAILY TADIPAAR RECORDS
// ===============================
export const dummyDailyRecords = [
  {
    _id: "R1",
    criminalId: "C1",
    date: "2026-02-20",
    status: "compliant",
    selfieUrl: "https://via.placeholder.com/100",
  },
  {
    _id: "R2",
    criminalId: "C1",
    date: "2026-02-21",
    status: "location_violation",
    selfieUrl: "https://via.placeholder.com/100",
  },
  {
    _id: "R3",
    criminalId: "C2",
    date: "2026-02-21",
    status: "not_reported",
    selfieUrl: "",
  },
];