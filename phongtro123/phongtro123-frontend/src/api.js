import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ đúng cú pháp của Vite
});

export default api;
