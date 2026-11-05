export function isStaffRole(role: string) {
  return role === "STAFF" || role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isAdminRole(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function roleLabel(role: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super admin";
    case "ADMIN":
      return "Admin";
    case "STAFF":
      return "Staff";
    default:
      return "Customer";
  }
}
