const clientModel = require('../models/clientModel');
const HttpError = require('../utils/httpError');
const asyncHandler = require('../utils/asyncHandler');
const parseId = require('../utils/parseId');
const { parsePagination } = require('../utils/pagination');
const {
  isNonEmptyString,
  isOptionalString,
  isOptionalDateString,
  isNonNegativeInteger,
  isNonNegativeNumber,
} = require('../utils/validate');

function normalizeClientPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Тело запроса должно быть объектом');
  }

  const errors = [];

  if (!isNonEmptyString(body.full_name, 255)) {
    errors.push('Поле "full_name" обязательно и должно быть строкой до 255 символов');
  }

  let city = body.city;

  if (typeof city === 'string' && city.trim() === '') {
    city = null;
  }

  if (!isOptionalString(city, 100)) {
    errors.push('Поле "city" должно быть строкой до 100 символов');
  }

  let birthDate = body.birth_date;

  if (typeof birthDate === 'string' && birthDate.trim() === '') {
    birthDate = null;
  }

  if (!isOptionalDateString(birthDate)) {
    errors.push('Поле "birth_date" должно быть датой в формате YYYY-MM-DD');
  }

  const loyaltyRaw = body.loyalty_points;
  const loyaltyPoints =
    loyaltyRaw === undefined || loyaltyRaw === null || loyaltyRaw === ''
      ? 0
      : Number(loyaltyRaw);

  if (!isNonNegativeInteger(loyaltyPoints)) {
    errors.push('Поле "loyalty_points" должно быть целым числом больше или равным 0');
  }

  const discountRaw = body.discount;
  const discount =
    discountRaw === undefined || discountRaw === null || discountRaw === ''
      ? 0
      : Number(discountRaw);

  if (!isNonNegativeNumber(discount) || discount > 100) {
    errors.push('Поле "discount" должно быть числом от 0 до 100');
  }

  if (errors.length) {
    throw new HttpError(400, errors.join('; '));
  }

  return {
    full_name: body.full_name.trim(),
    city: city ? String(city).trim() : null,
    birth_date: birthDate,
    loyalty_points: loyaltyPoints,
    discount,
  };
}

async function getClients(req, res) {
  const { limit, offset } = parsePagination(req.query);
  const page = await clientModel.getPage(limit, offset);

  res.json(page);
}

async function getAllClients(req, res) {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  if (search.length > 100) {
    throw new HttpError(400, 'Параметр "search" не должен быть длиннее 100 символов');
  }

  const hasPagination =
    req.query.limit !== undefined || req.query.offset !== undefined;

  const { limit, offset } = hasPagination
    ? parsePagination(req.query)
    : { limit: null, offset: null };

  const page = await clientModel.getAll({ limit, offset, search });

  res.json(page);
}

async function getClientById(req, res) {
  const id = parseId(req.params.id);
  const client = await clientModel.getById(id);

  if (!client) {
    throw new HttpError(404, 'Клиент не найден');
  }

  res.json(client);
}

async function createClient(req, res) {
  const payload = normalizeClientPayload(req.body);
  const client = await clientModel.create(payload);

  res.status(201).json(client);
}

async function updateClient(req, res) {
  const id = parseId(req.params.id);
  const payload = normalizeClientPayload(req.body);
  const updatedClient = await clientModel.update(id, payload);

  if (!updatedClient) {
    throw new HttpError(404, 'Клиент не найден');
  }

  res.json(updatedClient);
}

async function deleteClient(req, res) {
  const id = parseId(req.params.id);
  const deleted = await clientModel.remove(id);

  if (!deleted) {
    throw new HttpError(404, 'Клиент не найден');
  }

  res.status(204).send();
}

module.exports = {
  getClients: asyncHandler(getClients),
  getAllClients: asyncHandler(getAllClients),
  getClientById: asyncHandler(getClientById),
  createClient: asyncHandler(createClient),
  updateClient: asyncHandler(updateClient),
  deleteClient: asyncHandler(deleteClient),
};