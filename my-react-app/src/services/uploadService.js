import { apiFetch } from "./api";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return apiFetch("/upload", {
    method: "POST",
    body: formData,
  });
};
