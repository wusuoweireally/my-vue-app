import request from "./request";

export default {
  getTableData() {
    return request({
      url: "/home/getTableData",
      method: "get",
      mock: false,
    });
  },

  getUserInfo() {
    return request({
      url: "/user",
      method: "get",
      mock: false,
    });
  },
  getCountData() {
    return request({
      url: "/home/getCountData",
      method: "get",
      mock: false,
    });
  },
  getChartData() {
    return request({
      url: "/home/getChartData",
      method: "get",
    });
  },
};
