export const ROLE_PERMISSIONS = {
  "site engineer": [
    "/dashboard",
    "/Inspection",
    "/add-report",
    "/report-history",
    "/asset/view",
  ],
  "project supervisor": ["*"],
  admin: ["*"],
  "qa officer": ["/Defects"],
};

export const getUserRole = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    return userData?.type?.toLowerCase() || null;
  } catch {
    return null;
  }
};

export const hasAccess = (url) => {
  if (!url || url === "#") return true; // keep titles & disabled links

  const role = getUserRole();
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role] || [];

  if (permissions.includes("*")) return true;

  return permissions.some(
    (allowed) => url === allowed || url.startsWith(allowed)
  );
};