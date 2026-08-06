import axios from "axios";
import ApiError from "./apiError";
import useAuthStore from "./token";

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // const token = useAuthStore((state) => state.accessToken);
    const token = useAuthStore.getState().accessToken
    console.log (token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response.data,

  async (error) => {
      const originalRequest = error.config;

      // Refresh expired access token
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh-token")
      ) {
        originalRequest._retry = true;

        try {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(
                `${BASE_URL}/auth/refresh-token`,
                {},
                { withCredentials: true }
              )
              .then((res) => {
                const token = res.data;
                useAuthStore.getState().setAccessToken(token);
                return token;
              })
              .finally(() => {
                refreshPromise = null;
              });
          }

          const token = await refreshPromise;

          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        } catch (err) {
          useAuthStore.getState().logout();
          window.location.assign("/login?session=expired");

          return Promise.reject(
            new ApiError({
              message: "Your session has expired. Please log in again.",
              status: 401,
            })
          );
        }
      }

    // 2. Handle Server errors (Server responded with a status code)
    const { status, data } = error.response;

    if (status === 404) {
      return Promise.reject(
        new ApiError({
          message: data?.message || "The requested resource could not be found.",
          code: "NOT_FOUND",
          status: 404,
        })
      );
    }

    if (status === 401) {
      return Promise.reject(
        new ApiError({
          message: data?.error || "user is unauthorized.",
          code: "invalid credentials",
          status: 401,
        })
      );
    }
    if (status === 429) {
      return Promise.reject(
        new ApiError({
          message: data?.message || "too many requests. try again later.",
          code: "too many requests",
          status: 429,
        })
      );
    }
    if (status === 403) {
      return Promise.reject(
        new ApiError({
          message: data?.message || "forbidden request",
          code: "forbidden",
          status: 403,
        })
      );
    }

    // Request cancelled
    if (axios.isCancel(error)) {
      return Promise.reject(
        new ApiError({
          message: "Request cancelled.",
          isCancel: true,
        })
      );
    }

    // Network/timeout error
    if (!error.response) {
      return Promise.reject(
        new ApiError({
          message:
            error.code === "ECONNABORTED"
              ? "The request timed out. Please try again."
              : "Network error. Check your connection.",
          code: error.code,
          isNetwork: true,
        })
      );
    }

    // Other API errors
    return Promise.reject(
      new ApiError({
        message: error.response.data?.message || "Something went wrong.",
        status: error.response.status,
        code: error.code,
      })
    );
  }
);

export default api;