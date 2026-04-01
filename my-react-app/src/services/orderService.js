import { apiFetch } from "./api";

export const createOrder = async (orderData) => {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getMyOrders = async () => {
  return apiFetch("/orders/my", {
    method: "GET",
  });
};

export const getAllOrders = async () => {
  return apiFetch("/orders", {
    method: "GET",
  });
};

export const updateOrderStatus = async (id, status) => {
  return apiFetch(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};
