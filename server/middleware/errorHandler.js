module.exports = function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Некорректный JSON',
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'Тело запроса слишком большое',
    });
  }

  // PostgreSQL: foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      message: 'Операция невозможна: запись связана с другими данными или ссылается на несуществующую запись',
    });
  }

  // PostgreSQL: unique violation
  if (err.code === '23505') {
    return res.status(409).json({
      message: 'Такая запись уже существует',
    });
  }
  // PostgreSQL: date or time value out of range
  if (err.code === '22008' || err.code === '22007') {
    return res.status(400).json({
      message: 'Некорректная дата',
    });
  }

  // PostgreSQL: invalid input syntax
  if (err.code === '22P02') {
    return res.status(400).json({
      message: 'Некорректный формат данных',
    });
  }

  const status = Number.isInteger(err.status) ? err.status : 500;

  const message =
    status < 500
      ? err.message || 'Ошибка запроса'
      : 'Внутренняя ошибка сервера';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    message,
  });
};