import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((req) => {
  let token;
  
  if (req.url.includes('/admin/')) {
    token = window.localStorage.getItem("adminToken");
  } else {
    token = window.localStorage.getItem("token");
  }

  if (token) {
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return req;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      (error.response.data?.error?.includes("Unauthorized") ||
       error.response.data?.message?.includes("Unauthorized") ||
       error.response.data?.error?.includes("Token") ||
       error.response.data?.message?.includes("Token"))
    ) {
      if (error.config.url.includes('/admin/')) {
        window.localStorage.removeItem("adminToken");
        window.location.replace("/admin-login");
      } else {
        window.localStorage.removeItem("token");
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;