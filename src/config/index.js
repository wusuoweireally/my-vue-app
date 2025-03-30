const EnvConfig = {
  development: {
    mock: false,
    api: "/api",
    mockApi: "http://127.0.0.1:4523/m1/6069469-5759728-default",
  },
  test: {
    mock: false,
    api: "/test/api",
    mockApi: "https://mock.apifox.cn/your-mock-id",
  },
  production: {
    mock: false,
    api: "/prod/api",
    mockApi: "https://mock.apifox.cn/your-mock-id",
  },
};

// 获取当前环境
const env = process.env.NODE_ENV || "development";
const currentConfig = EnvConfig[env];
// console.log("当前环境：", env);
// console.log("当前配置：", currentConfig);
export const { mock, api, mockApi } = currentConfig;
