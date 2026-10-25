function parsePagination(query, options = {}) {
  const defaultLimit = options.defaultLimit ?? 30;
  const maxLimit = options.maxLimit ?? 100;

  let limit = Number.parseInt(query.limit, 10);
  let offset = Number.parseInt(query.offset, 10);

  if (!Number.isInteger(limit) || limit <= 0) {
    limit = defaultLimit;
  }

  if (!Number.isInteger(offset) || offset < 0) {
    offset = 0;
  }

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  return {
    limit,
    offset,
  };
}

module.exports = {
  parsePagination,
};