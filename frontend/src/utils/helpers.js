export const formatPrice = (price) => Number(price || 0).toFixed(2);

export const getRating = (id = '') => {
  const seed = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 4 + (seed % 10) / 10;
};