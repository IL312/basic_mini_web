const db = require('../config/db');

const baseSelect = `
  SELECT
    orders.id,
    orders.client_id,
    clients.full_name AS client_name,
    orders.title,
    to_char(orders.order_date, 'YYYY-MM-DD') AS order_date,
    orders.quantity,
    orders.amount
  FROM orders
  JOIN clients ON clients.id = orders.client_id
`;

async function getPage(clientId, limit, offset) {
  const data = await db.any(
    `
      ${baseSelect}
      WHERE $1::int IS NULL OR orders.client_id = $1
      ORDER BY orders.id DESC
      LIMIT $2 OFFSET $3
    `,
    [clientId, limit, offset]
  );

  const total = await db.one(
    `
      SELECT COUNT(*)::int AS total
      FROM orders
      WHERE $1::int IS NULL OR client_id = $1
    `,
    [clientId],
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
      ${baseSelect}
      WHERE orders.id = $1
    `,
    [id]
  );
}

async function create(payload) {
  const inserted = await db.one(
    `
      INSERT INTO orders (
        client_id,
        title,
        order_date,
        quantity,
        amount
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    [
      payload.client_id,
      payload.title,
      payload.order_date,
      payload.quantity,
      payload.amount,
    ]
  );

  return getById(inserted.id);
}

async function update(id, payload) {
  const updated = await db.oneOrNone(
    `
      UPDATE orders
      SET
        client_id = $2,
        title = $3,
        order_date = $4,
        quantity = $5,
        amount = $6
      WHERE id = $1
      RETURNING id
    `,
    [
      id,
      payload.client_id,
      payload.title,
      payload.order_date,
      payload.quantity,
      payload.amount,
    ]
  );

  if (!updated) {
    return null;
  }

  return getById(updated.id);
}

async function remove(id) {
  const result = await db.result(
    `
      DELETE FROM orders
      WHERE id = $1
    `,
    [id],
    (r) => r.rowCount
  );

  return result > 0;
}

module.exports = {
  getPage,
  getById,
  exists,
  create,
  update,
  remove,
};