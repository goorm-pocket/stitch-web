import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message;
    console.log("eeee", status, message);

    // Todo : 시간 남으면 toast같은거 만들어서 보여줄 예정
    switch (status) {
      case 401:
        window.location.href = "/";
        break;
    }

    return Promise.reject(err);
  },
);
