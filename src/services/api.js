import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);

// 서버와 통신하기 위해 axios 객체 생성(기본주소) 이름이 api 객체
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

//Axios 인터셉터로 미리 jwt 토큰을 가져와 헤더에 설정
api.interceptors.request.use(
  async (config) => {
    //로컬스토리지에 jwt토큰이 있으면 헤더에 추가함
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
