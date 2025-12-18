import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);

// api 엑시오스 객체에 미리 설정(기본주소, 헤더)
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// 인터셉터로 백엔드 서버로 요청시 먼저 토큰을 헤더에 설정
api.interceptors.request.use(
  async (config) => {
    // 로컬스토리지에 저장된 토큰을 가져옴(로그인시 저장됨)
    const token = localStorage.getItem("JWT_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
