function isNonEmptyString(value, maxLength = 255) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

function isOptionalString(value, maxLength = 255) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    isNonEmptyString(value, maxLength)
  );
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isInteger(value) {
  return Number.isInteger(value);
}

function isNonNegativeInteger(value) {
  return isInteger(value) && value >= 0;
}

function isPositiveInteger(value) {
  return isInteger(value) && value > 0;
}

function isNonNegativeNumber(value) {
  return isFiniteNumber(value) && value >= 0;
}

function isDateString(value) {
  if (typeof value !== 'string') {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime());
}

function isOptionalDateString(value) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    isDateString(value)
  );
}

module.exports = {
  isNonEmptyString,
  isOptionalString,
  isFiniteNumber,
  isInteger,
  isNonNegativeInteger,
  isPositiveInteger,
  isNonNegativeNumber,
  isDateString,
  isOptionalDateString,
};