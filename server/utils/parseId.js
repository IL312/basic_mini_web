const HttpError = require('./httpError');

function parseId(rawId) {
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'Некорректный идентификатор');
  }

  return id;
}

module.exports = parseId;