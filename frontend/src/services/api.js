import axios from "axios";

export const api = axios.create({
    baseURL: "/api"
})

api.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token) req.headers.Authorization = `Bearer ${token}`;
    return req;
})