export const isDCP = (user) => user?.role === "DCP";
export const isACP = (user) => user?.role === "ACP";
export const isStationAdmin = (user) =>
  user?.role === "STATION_ADMIN";

// 🔹 scope filters
export const canViewAll = (user) => user?.role === "DCP";

export const canDeleteOfficer = (user) => user?.role === "DCP";

export const canViewFullAnalytics = (user) =>
  user?.role === "DCP" || user?.role === "ACP";