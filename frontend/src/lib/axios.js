import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://backend-chatbot-ihuw.onrender.com/api" : "/api",
  withCredentials: true,
});
