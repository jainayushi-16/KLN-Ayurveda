import { axiosClient } from "./axiosClient";
export const authApi = {
    register: (data) => axiosClient.post("/auth/register", data),
    login: (data) => axiosClient.post("/auth/login", data),
    logout: () => axiosClient.post("/auth/logout"),
    refreshToken: () => axiosClient.post("/auth/refresh-token"),
    changePassword: (data) => axiosClient.post("/auth/change-password", data),
    getMe: () => axiosClient.get("/auth/me"),
};
