import axios from "axios";

// instance of axios
const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

export default api;