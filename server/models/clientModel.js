const db = require('../config/db');

const selectColumns = `
  id,
  full_name,
  city,
  to_char(birth_date, 'YYYY-MM-DD') AS birth_date,
  loyalty_points,
  discount
`;

async function getPage(limit, offset) {
  const data = await db.any(
    `
      SELECT ${selectColumns}
      FROM clients
      ORDER BY id
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  const total = await db.one(
    `
      SELECT COUNT(*)::int AS total
      FROM clients
    `,
    [],
    (row) => row.total
  );

  return {
    data,
    total,
  };
}

async function getAll({ limit = null, offset = null, search = '' } = {}) {
  const pattern = `%${search.replace(/[\\%_]/g, '\\$&')}%`;
  const params = [pattern];

  let limitOffset = '';
  if (limit !== null && offset !== null) {
    params.push(limit, offset);
    limitOffset = `LIMIT $${params.length - 1} OFFSET $${params.length}`;
  }

  const data = await db.any(
    `
      SELECT id, full_name
      FROM clients
      WHERE full_name ILIKE $1
      ORDER BY full_name, id
      ${limitOffset}
    `,
    params
  );

  const total = await db.one(
    `
      SELECT COUNT(*)::int AS total
      FROM clients
      WHERE full_name ILIKE $1
    `,
    [pattern],
    (row) => row.total
  );

  return {
    data,
    total,
  };
}

async function getById(id) {
  return db.oneOrNone(
    `
      SELECT ${selectColumns}
      FROM clients
      WHERE id = $1
    `,
    [id]
  );
}

async function exists(id) {
  return db.one(
    `
      SELECT EXISTS (
        SELECT 1
        FROM clients
        WHERE id = $1
      ) AS exists
    `,
    [id],
    (row) => row.exists
  );
}

async function create(payload) {
  return db.one(
    `
      INSERT INTO clients (
        full_name,
        city,
        birth_date,
        loyalty_points,
        discount
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${selectColumns}
    `,
    [
      payload.full_name,
      payload.city,
      payload.birth_date,
      payload.loyalty_points,
      payload.discount,
    ]
  );
}

async function update(id, payload) {
  return db.oneOrNone(
    `
      UPDATE clients
      SET
        full_name = $2,
        city = $3,
        birth_date = $4,
        loyalty_points = $5,
        discount = $6
      WHERE id = $1
      RETURNING ${selectColumns}
    `,
    [
      id,
      payload.full_name,
      payload.city,
      payload.birth_date,
      payload.loyalty_points,
      payload.discount,
    ]
  );
}

async function remove(id) {
  const result = await db.result(
    `
      DELETE FROM clients
      WHERE id = $1
    `,
    [id],
    (r) => r.rowCount
  );

  return result > 0;
}

module.exports = {
  getPage,
  getAll,
  getById,
  exists,
  create,
  update,
  remove,
};