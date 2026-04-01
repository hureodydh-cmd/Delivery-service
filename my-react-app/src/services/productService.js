import { apiFetch } from "./api";

export const getAllProducts = async () => {
  return apiFetch("/products", {
    method: "GET",
  });
};

export const getProductById = async (id) => {
  return apiFetch(`/products/${id}`, {
    method: "GET",
  });
};

export const createProduct = async (productData) => {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id, productData) => {
  return apiFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
};
