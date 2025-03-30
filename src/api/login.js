import request from "./request";

export default {
  getMenu(params) {
    return request({
      url: "/permission/getMenu",
      method: "post",
      data: params,
    });
  },
};
