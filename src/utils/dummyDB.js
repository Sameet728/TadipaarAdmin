// ======================================================
// 📦 TADIPAAR DUMMY MASTER DATA (STEP 1)
// Frontend Only | Sameet Project
// ======================================================

// ======================================================
// 🚔 ADMINS (ROLE TESTING)
// ======================================================
// src/data/demoUsers.js

const demoUsers = [
  {
    id: "U1",
    username: "cp_pune",
    password: "123456",
    role: "CP",
    name: "CP Pune",
    zone: null, // CP sees all zones
  },
  {
    id: "U2",
    username: "dcp_pune",
    password: "123456",
    role: "DCP",
    name: "DCP Pune",
    zone: "Zone-2", // ⭐ REQUIRED for DCP dashboard
  },
  {
    id: "U3",
    username: "acp_zone1",
    password: "123456",
    role: "ACP",
    name: "ACP Zone 1",
    zone: "Zone-1", // ⭐ REQUIRED for ACP dashboard
  },
  {
    id: "U4",
    username: "station_admin",
    password: "123456",
    role: "STATION_ADMIN",
    name: "PSI Wakad",
    zone: "Zone-2",
    policeStation: "Wakad PS",
  },
  {
    id: "U5",
    username: "ramesh_k",
    password: "123",
    role: "CRIMINAL",
    name: "Ramesh Pawar",
  },
];



export default demoUsers;

// 🔥 change index to test role

// ======================================================
// 🗺️ AREA DEMARCATION (AS PROVIDED BY POLICE)
// ======================================================
export const areaDemarcation = [
  {
    zone: "Zone-1",
    acps: [
      {
        name: "ACP Pimpri",
        stations: ["Pimpri PS", "Chinchwad PS", "Nigdi PS"],
      },
      {
        name: "ACP Sangawi",
        stations: [
          "Sant Tukaram Nagar PS",
          "Dapodi PS",
          "Sangawi PS",
        ],
      },
    ],
  },
  {
    zone: "Zone-2",
    acps: [
      {
        name: "ACP Wakad",
        stations: ["Wakad PS", "Kalewadi PS", "Ravet PS"],
      },
      {
        name: "ACP Hinjewadi",
        stations: ["Hinjewadi PS", "Bawdhan PS"],
      },
    ],
  },
  {
    zone: "Zone-3",
    acps: [
      {
        name: "ACP Bhosari MIDC",
        stations: ["Bhosari MIDC PS", "Dighi PS", "Bhosari PS"],
      },
      {
        name: "ACP Chakan",
        stations: [
          "Chakan South PS",
          "Chakan North PS",
          "Alandi PS",
        ],
      },
    ],
  },
  {
    zone: "Zone-4",
    acps: [
      {
        name: "ACP Dehu Road",
        stations: ["Dehu Road PS", "Shirgaon PS", "Chikhali PS"],
      },
      {
        name: "ACP Mhalunge MIDC",
        stations: ["Mhalunge North PS", "Mhalunge South PS"],
      },
    ],
  },
];

// ======================================================
// 👤 EXTERNEE MASTER (POLICE STATION LEVEL DATA)
// ✅ includes ALL required fields
// ======================================================
export const dummyExternees = [
  {
    _id: "EX1",

    // Basic
    name: "Ramesh Pawar",
    address: "Shivaji Nagar, Pune",
    policeStation: "Wakad PS",
    zone: "Zone-2",
    acp: "ACP Wakad",

    // Externment
    externmentSections: [55, 56],
    externmentFrom: "2026-02-01",
    externmentTill: "2026-06-01",
    externmentResidence: "Satara, Maharashtra",

    // Photo
    photoUrl: "https://via.placeholder.com/100",
    photoUploadedAt: "2026-02-10",

    // Monitoring helpers (IMPORTANT)
    enteredInOurArea: false,

    createdAt: "2026-02-01",
  },

  {
    _id: "EX2",
    name: "Suresh Shinde",
    address: "Bhosari MIDC, Pune",
    policeStation: "Bhosari MIDC PS",
    zone: "Zone-3",
    acp: "ACP Bhosari MIDC",

    externmentSections: [57],
    externmentFrom: "2026-01-15",
    externmentTill: "2026-05-15",
    externmentResidence: "Solapur, Maharashtra",

    photoUrl: "", // ❌ not uploaded
    photoUploadedAt: null,

    enteredInOurArea: true, // 🚨 violation sample

    createdAt: "2026-01-15",
  },

  {
    _id: "EX3",
    name: "Akash More",
    address: "Nigdi, Pune",
    policeStation: "Nigdi PS",
    zone: "Zone-1",
    acp: "ACP Pimpri",

    externmentSections: [55, 57],
    externmentFrom: "2026-02-05",
    externmentTill: "2026-08-05",
    externmentResidence: "Nashik, Maharashtra",

    photoUrl: "https://via.placeholder.com/100",
    photoUploadedAt: "2026-02-06",

    enteredInOurArea: false,

    createdAt: "2026-02-05",
  },
];

// ======================================================
// 🧮 DERIVED HELPERS (FOR ACP/DCP/CP DASHBOARD)
// ======================================================

export const getPhotoPendingDays = (externee) => {
  if (!externee.photoUploadedAt) return "Not Uploaded";

  const today = new Date();
  const uploaded = new Date(externee.photoUploadedAt);
  const diff = Math.floor((today - uploaded) / (1000 * 60 * 60 * 24));
  return diff;
};

export const photoPendingList = dummyExternees.filter(
  (e) => !e.photoUploadedAt
);

export const areaViolationList = dummyExternees.filter(
  (e) => e.enteredInOurArea
);
