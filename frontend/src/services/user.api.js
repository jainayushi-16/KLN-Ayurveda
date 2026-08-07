import { axiosClient } from "./axiosClient";
export const userApi = {
    getProfile: () => axiosClient.get("/users/profile"),
    updateProfile: (data) => axiosClient.put("/users/profile", data),
    getAddresses: () => axiosClient.get("/users/addresses"),
    addAddress: (data) => axiosClient.post("/users/addresses", data),
    deleteAccount: () => axiosClient.delete("/users/account"),
};
