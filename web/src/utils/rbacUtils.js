/**
 * Central RBAC utility for frontend permission checking.
 * Consistent with backend RBAC middleware.
 */

export const hasPermission = (user, requiredPermission) => {
  if (!user || !user.role) return false;

  const role = user.role;
  
  // 1. Superadmin or 'all' permission gets total access
  if (role.name === 'superadmin' || role.permissions?.includes('all')) {
    return true;
  }

  // 2. Handle array of permissions (OR logic)
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some(p => role.permissions?.includes(p));
  }

  // 3. Single permission check
  return role.permissions?.includes(requiredPermission);
};
