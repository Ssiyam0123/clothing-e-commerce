import api from '@/lib/api';

// ==========================================
// ⚙️ Client-side settings API Operations
// ==========================================

/**
 * Fetch settings from client side
 */
export const clientFetchSettings = async () => {
  const { data } = await api.get('/settings');
  return data;
};

/**
 * Update settings from client side
 */
export const clientUpdateSettings = async (updatedData) => {
  const isFormData = updatedData instanceof FormData;
  const { data } = await api.patch('/settings', updatedData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return data;
};

// ==========================================
// 🛡️ Client-side Roles API Operations
// ==========================================

/**
 * Fetch all roles
 */
export const fetchRoles = async () => {
  const { data } = await api.get('/roles');
  return data;
};

/**
 * Create a new role
 */
export const createRole = async (roleData) => {
  const { data } = await api.post('/roles', roleData);
  return data;
};

/**
 * Update an existing role
 */
export const updateRole = async (id, roleData) => {
  const { data } = await api.patch(`/roles/${id}`, roleData);
  return data;
};

/**
 * Delete a role
 */
export const deleteRole = async (id) => {
  const { data } = await api.delete(`/roles/${id}`);
  return data;
};

// ==========================================
// 🏗️ Client-side Home Layout (Layout Builder) API Operations
// ==========================================

/**
 * Fetch all home layout templates/versions
 */
export const fetchAllHomeLayouts = async () => {
  const { data } = await api.get('/home-layouts/all');
  return data;
};

/**
 * Fetch currently active home layout sections
 */
export const fetchActiveHomeLayout = async () => {
  const { data } = await api.get('/home-layouts');
  return data;
};

/**
 * Update layout sections for a specific layout version
 */
export const updateHomeLayout = async (id, sections) => {
  const { data } = await api.patch(`/home-layouts/${id}`, { sections });
  return data;
};

/**
 * Create a new home layout version
 */
export const createHomeLayout = async (name) => {
  const { data } = await api.post('/home-layouts', { name });
  return data;
};

/**
 * Activate/switch to a specific home layout version globally
 */
export const activateHomeLayout = async (id) => {
  const { data } = await api.patch(`/home-layouts/${id}/switch`);
  return data;
};

/**
 * Delete a home layout version
 */
export const deleteHomeLayout = async (id) => {
  const { data } = await api.delete(`/home-layouts/${id}`);
  return data;
};

/**
 * Fetch active marketing banner campaigns
 */
export const fetchBannerCampaigns = async () => {
  const { data } = await api.get('/banner-campaigns');
  return data;
};

/**
 * Fetch all subcategories
 */
export const fetchSubcategories = async () => {
  const { data } = await api.get('/subcategories');
  return data;
};

/**
 * Fetch active flash sale campaigns
 */
export const fetchAdminFlashSales = async () => {
  const { data } = await api.get('/admin/flash-sales');
  return data;
};

/**
 * Fetch products for custom section pickers
 */
export const fetchAdminProducts = async (params) => {
  const { data } = await api.get('/admin/products', { params });
  return data;
};
