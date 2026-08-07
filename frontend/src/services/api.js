import { axiosClient } from "./axiosClient";

export async function apiRequest(endpoint, options = {}) {
  const { token, headers, method = "GET", body, ...customConfig } = options;
  const config = {
    method,
    url: endpoint,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { data: typeof body === "string" ? JSON.parse(body) : body } : {}),
    ...customConfig,
  };

  try {
    const res = await axiosClient(config);
    return res;
  } catch (error) {
    return (
      error || {
        success: false,
        message: "Unable to connect to backend server.",
        data: null,
      }
    );
  }
}
