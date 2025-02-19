import axios from "axios";

const api = axios.create({
  baseURL: "https://api-upload-arquivos.onrender.com", // URL do seu backend
});

export default api;
