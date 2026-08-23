export const normalizeProductImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  const value = image.trim();

  if (!value) {
    return "";
  }

  if (value.includes("cloudinary.com") || /^data:/i.test(value)) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const apiOrigin = getApiOrigin();

  if (value.startsWith("/uploads/")) {
    return `${apiOrigin}${value}`;
  }

  if (value.startsWith("uploads/")) {
    return `${apiOrigin}/${value}`;
  }

  if (value.startsWith("/")) {
    return `${apiOrigin}${value}`;
  }

  return `${apiOrigin}/uploads/${value.replace(/^\/+/, "")}`;
};

export const formatPrice = (price) => {
  return Number(price || 0).toFixed(2);
};

export const getApiOrigin = () => {
  const configuredUrl =
    (import.meta.env.VITE_API_URL || "https://pido-backend.onrender.com/api").trim();

  try {
    const normalizedUrl = configuredUrl.startsWith("http")
      ? configuredUrl
      : `https://${configuredUrl}`;

    return new URL(normalizedUrl).origin;
  } catch {
    return "https://pido-backend.onrender.com";
  }
};


export const getRating = (id = "") => {
  const seed = id
    .split("")
    .reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0
    );

  return 4 + (seed % 10) / 10;
};