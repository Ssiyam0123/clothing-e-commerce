/**
 * Sanitise and parse standard pagination parameters from express query
 */
export const getPaginationParams = (query, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, parseInt(query.limit) || defaultLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Format standard paginated response metadata and structure
 */
export const formatPaginatedResponse = (data, totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return {
    results: data,
    pagination: {
      currentPage: page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};
