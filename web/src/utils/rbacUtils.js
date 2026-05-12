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

/**
 * Checks if the user has ANY administrative permission.
 * Used for top-level access to the admin panel.
 */
export const hasAnyAdminPermission = (user) => {
  if (!user || !user.role) return false;
  if (user.role.name === 'superadmin' || user.role.permissions?.includes('all')) return true;
  
  // Check if they have at least one permission
  // In this system, only admins/staff have roles with explicit permissions
  return (user.role.permissions && user.role.permissions.length > 0);
};

