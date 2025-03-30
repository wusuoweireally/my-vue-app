import axios from "axios";
import { ElMessage } from "element-plus";
import { mock, api, mockApi } from "@/config";

// 创建axios实例
const service = axios.create({
  timeout: 5000, // 请求超时时间
  baseURL: api,
});
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 可以在这里添加token等
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    const { code, data, msg } = response.data;

    if (code === 200) {
      return data;
    } else {
      ElMessage.error(msg || "请求错误");
      return Promise.reject(msg || "请求错误");
    }
  },
  function (error) {
    ElMessage.error(error.message || "网络错误");
    return Promise.reject(error);
  }
);

// 创建请求实例
function request(config) {
  //get请求参数处理
  if (config.method.toLowerCase() === "get") {
    // config.params = {
    //   ...config.data,
    // };
  }
  //对mock的开关做一下处理
  const useMock = config.mock !== undefined ? config.mock : mock;
  // 删除mock配置，避免发送到服务器
  if (process.env.NODE_ENV === "production") {
    service.defaults.baseURL = api;
  }
  if (useMock) {
    service.defaults.baseURL = mockApi;
  } else {
    service.defaults.baseURL = api;
  }
  // 删除config中的mock属性

  delete config.mock;

  return service(config);
}

export default request;
