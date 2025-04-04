import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const analyzeCode = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/analyze/", formData);
};
