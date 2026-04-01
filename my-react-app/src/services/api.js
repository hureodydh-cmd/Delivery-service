export const API_BASE_URL = "http://localhost:5000/api";
export const SERVER_BASE_URL = "http://localhost:5000";

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://via.placeholder.com/400x300?text=No+Image";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads")) {
    return `${SERVER_BASE_URL}${imagePath}`;
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  return `${SERVER_BASE_URL}${imagePath}`;
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
