const orderModel = require('../models/orderModel');
const clientModel = require('../models/clientModel');
const HttpError = require('../utils/httpError');
const asyncHandler = require('../utils/asyncHandler');
const parseId = require('../utils/parseId');
const { parsePagination } = require('../utils/pagination');
const {
  isNonEmptyString,
  isDateString,
  isPositiveInteger,
  isNonNegativeNumber,
} = require('../utils/validate');

function normalizeOrderPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Тело запроса должно быть объектом');
  }

  const errors = [];

  const clientIdRaw = body.client_id;
  const clientId = Number(clientIdRaw);

  if (
    clientIdRaw === undefined ||
    clientIdRaw === null ||
    clientIdRaw === '' ||
    !isPositiveInteger(clientId)
  ) {
    errors.push('Поле "client_id" должно быть положительным целым числом');
  }

  if (!isNonEmptyString(body.title, 255)) {
    errors.push('Поле "title" обязательно и должно быть строкой до 255 символов');
  }

  if (!isDateString(body.order_date)) {
    errors.push('Поле "order_date" должно быть датой в формате YYYY-MM-DD');
  }

  const quantityRaw = body.quantity;
  const quantity = Number(quantityRaw);

  if (
    quantityRaw === undefined ||
    quantityRaw === null ||
    quantityRaw === '' ||
    !isPositiveInteger(quantity)
  ) {
    errors.push('Поле "quantity" должно быть положительным целым числом');
  }

  const amountRaw = body.amount;
  const amount = Number(amountRaw);

  if (
    amountRaw === undefined ||
    amountRaw === null ||
    amountRaw === '' ||
    !isNonNegativeNumber(amount)
  ) {
    errors.push('Поле "amount" должно быть числом больше или равным 0');
  }

  if (errors.length) {
    throw new HttpError(400, errors.join('; '));
  }

  return {
    client_id: clientId,
    title: body.title.trim(),
    order_date: body.order_date,
    quantity,
    amount,
  };
}

async function getOrders(req, res) {
  let clientId = null;

  if (req.query.clientId !== undefined && req.query.clientId !== '') {
    clientId = Number(req.query.clientId);

    if (!Number.isInteger(clientId) || clientId <= 0) {
      throw new HttpError(400, 'Некорректный параметр "clientId"');
    }
  }

  const { limit, offset } = parsePagination(req.query);
  const page = await orderModel.getPage(clientId, limit, offset);

  res.json(page);
}

async function getOrderById(req, res) {
  const id = parseId(req.params.id);
  const order = await orderModel.getById(id);

  if (!order) {
    throw new HttpError(404, 'Заказ не найден');
  }

  res.json(order);
}

async function createOrder(req, res) {
  const payload = normalizeOrderPayload(req.body);
  const clientExists = await clientModel.exists(payload.client_id);

  if (!clientExists) {
    throw new HttpError(400, 'Указанный клиент не найден');
  }

  const order = await orderModel.create(payload);

  res.status(201).json(order);
}

async function updateOrder(req, res) {
  const id = parseId(req.params.id);
  const payload = normalizeOrderPayload(req.body);
  const clientExists = await clientModel.exists(payload.client_id);

  if (!clientExists) {
    throw new HttpError(400, 'Указанный клиент не найден');
  }

  const updatedOrder = await orderModel.update(id, payload);

  if (!updatedOrder) {
    throw new HttpError(404, 'Заказ не найден');
  }

  res.json(updatedOrder);
}

async function deleteOrder(req, res) {
  const id = parseId(req.params.id);
  const deleted = await orderModel.remove(id);

  if (!deleted) {
    throw new HttpError(404, 'Заказ не найден');
  }

  res.status(204).send();
}

module.exports = {
  getOrders: asyncHandler(getOrders),
  getOrderById: asyncHandler(getOrderById),
  createOrder: asyncHandler(createOrder),
  updateOrder: asyncHandler(updateOrder),
  deleteOrder: asyncHandler(deleteOrder),
};