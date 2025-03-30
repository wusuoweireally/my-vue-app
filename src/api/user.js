import request from "./request";
import { mock } from "mockjs";

export default {
  getUserData(data) {
    console.log("user.js接口中的", data);

    return request({
      url: "/user/getUserData",
      method: "get",
      data,
      mock: false,
    });
  },
  deleteUser(params) {
    return request({
      url: "/user/deleteUser",
      method: "get",
      data: params,
    });
  },
  //编辑
  editUser(params) {
    return request({
      url: "/user/editUser",
      method: "post",
      data: params,
    });
  },
  //添加
  addUser(params) {
    return request({
      url: "/user/addUser",
      method: "post",
      data: params,
    });
  },
};
