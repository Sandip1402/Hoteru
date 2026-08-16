export const buildListingFilters = (query) => {
  const where = {
    status: "APPROVED",
    isActive: true,
  };

  if (query.city) {
    where.city = {
      contains: query.city,
      mode: "insensitive",
    };
  }

  if (query.country) {
    where.country = {
      contains: query.country,
      mode: "insensitive",
    };
  }

  if (query.type) {
    where.type = query.type;
  }

  return where;
};