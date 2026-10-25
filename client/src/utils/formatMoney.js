export const formatMoney = (value) => {
  if (value === null || value === undefined) return '';

  const num = Number(value);

  if (Number.isNaN(num)) return '';

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};