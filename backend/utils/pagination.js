export const getPagination = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};