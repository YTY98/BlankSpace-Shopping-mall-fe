import axios from "axios";
// 상황따라 주소 다름
const LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND;
// const PROD_BACKEND = process.env.REACT_APP_PROD_BACKEND;
// const BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY;
// console.log("proxy", BACKEND_PROXY);
const api = axios.create({
  baseURL: LOCAL_BACKEND,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});

export const setAuthToken = (token) => {
  if (token) {
    // 로컬 스토리지에 토큰 저장
    localStorage.setItem("token", token);

    // API 요청 헤더에 토큰 설정
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("인증 토큰 설정됨:", token.substring(0, 15) + "...");
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common['Authorization'];
    console.log("인증 토큰 제거됨");
  }
};

/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    // console.log("Starting Request", request);
    // request.headers.authorization = `Bearer ${token}`;
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    error = error.response.data;
    console.log("RESPONSE ERROR", error);
    return Promise.reject(error);
  }
);

export default api;
