export interface SearchFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

/**
 * Dynamically builds a secure parameterized SQL query for vehicle searches.
 * Extracted to keep controller logic clean and maintainable.
 */
export const buildVehicleSearchQuery = (
  filters: SearchFilters,
): { fetchQuery: string; queryParams: any[] } => {
  let queryParams: any[] = [];
  let conditions: string[] = [];

  if (filters.make) {
    queryParams.push(`%${filters.make}%`);
    conditions.push(`make ILIKE $${queryParams.length}`);
  }

  if (filters.model) {
    queryParams.push(`%${filters.model}%`);
    conditions.push(`model ILIKE $${queryParams.length}`);
  }

  if (filters.category) {
    queryParams.push(`%${filters.category}%`);
    conditions.push(`category ILIKE $${queryParams.length}`);
  }

  if (filters.minPrice) {
    queryParams.push(parseFloat(filters.minPrice as string));
    conditions.push(`price >= $${queryParams.length}`);
  }

  if (filters.maxPrice) {
    queryParams.push(parseFloat(filters.maxPrice as string));
    conditions.push(`price <= $${queryParams.length}`);
  }

  let fetchQuery = `SELECT * FROM vehicles`;
  if (conditions.length > 0) {
    fetchQuery += ` WHERE ` + conditions.join(' AND ');
  }
  fetchQuery += ` ORDER BY created_at DESC`;

  return { fetchQuery, queryParams };
};
