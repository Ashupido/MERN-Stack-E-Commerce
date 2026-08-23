export const USD_TO_ETB = 161.92;

export const convertPrice = (price, currency = 'ETB') => {
  const amount = Number(price || 0) || 0;

  if (currency === 'USD') {
    return amount / USD_TO_ETB;
  }

  return amount;
};

export const formatCurrency = (price, currency = 'ETB') => {
  const converted = convertPrice(price, currency);

  if (currency === 'USD') {
    return `$${converted.toFixed(2)}`;
  }

  return `${converted.toFixed(2)} ETB`;
};
