import Mock from "mockjs";
import userApi from "./mockdata/user";
import permissionApi from "./mockdata/permissionApi";
// 设置拦截请求的延时
Mock.setup({
  timeout: "200-600",
});
const getChartData = () => {
  return {
    code: 200,
    data: {
      orderData: {
        date: [
          "2019-10-01",
          "2019-10-02",
          "2019-10-03",
          "2019-10-04",
          "2019-10-05",
          "2019-10-06",
          "2019-10-07",
        ],
        data: [
          {
            苹果: 3839,
            小米: 1423,
            华为: 4965,
            oppo: 3334,
            vivo: 2820,
            一加: 4751,
          },
          {
            苹果: 3560,
            小米: 2099,
            华为: 3192,
            oppo: 4210,
            vivo: 1283,
            一加: 1613,
          },
          {
            苹果: 1864,
            小米: 4598,
            华为: 4202,
            oppo: 4377,
            vivo: 4123,
            一加: 4750,
          },
          {
            苹果: 2634,
            小米: 1458,
            华为: 4155,
            oppo: 2847,
            vivo: 2551,
            一加: 1733,
          },
          {
            苹果: 3622,
            小米: 3990,
            华为: 2860,
            oppo: 3870,
            vivo: 1852,
            一加: 1712,
          },
          {
            苹果: 2004,
            小米: 1864,
            华为: 1395,
            oppo: 1315,
            vivo: 4051,
            一加: 2293,
          },
          {
            苹果: 3797,
            小米: 3936,
            华为: 3642,
            oppo: 4408,
            vivo: 3374,
            一加: 3874,
          },
        ],
      },
      videoData: [
        { name: "小米", value: 2999 },
        { name: "苹果", value: 5999 },
        { name: "vivo", value: 1500 },
        { name: "oppo", value: 1999 },
        { name: "魅族", value: 2200 },
        { name: "三星", value: 4500 },
      ],
      userData: [
        { date: "周一", new: 5, active: 200 },
        { date: "周二", new: 10, active: 500 },
        { date: "周三", new: 12, active: 550 },
        { date: "周四", new: 60, active: 800 },
        { date: "周五", new: 65, active: 550 },
        { date: "周六", new: 53, active: 770 },
        { date: "周日", new: 33, active: 170 },
      ],
    },
  };
};
// 生成数据的函数
const generateData = () => {
  const frameworks = ["Vue", "React", "Angular"];
  return frameworks.map((name) => ({
    name,
    todayBuy: Mock.Random.float(100, 1000, 0, 2),
    monthBuy: Mock.Random.float(3000, 5000, 0, 2),
    totalBuy: Mock.Random.float(40000, 100000, 0, 2),
  }));
};

// 生成table数据的函数
const getCountData = () => {
  return [
    {
      name: "今日支付订单",
      value: 1234,
      icon: "SuccessFilled",
      color: "#2ec7c9",
    },
    {
      name: "今日收藏订单",
      value: 210,
      icon: "StarFilled",
      color: "#ffb980",
    },
    {
      name: "今日未支付订单",
      value: 1234,
      icon: "GoodsFilled",
      color: "#5ab1ef",
    },
    {
      name: "本月支付订单",
      value: 1234,
      icon: "SuccessFilled",
      color: "#2ec7c9",
    },
    {
      name: "本月收藏订单",
      value: 210,
      icon: "StarFilled",
      color: "#ffb980",
    },
    {
      name: "本月未支付订单",
      value: 1234,
      icon: "GoodsFilled",
      color: "#5ab1ef",
    },
  ];
};
// Mock拦截请求
// Mock.mock("/api/home/getTableData", "get", () => {
//   return {
//     code: 200,
//     data: generateData(),
//     message: "请求成功",
//   };
// });

// 用户数据
Mock.mock("/api/user", "get", {
  code: 200,
  message: "获取成功",
  data: {
    id: 1,
    username: Mock.mock("@cname"),
    email: Mock.mock("@email"),
    role: "超级管理员",
  },
});

//table数据
Mock.mock("/api/home/getCountData", "get", () => {
  return {
    code: 200,
    data: getCountData(),
    message: "请求成功",
  };
});

//chart数据
Mock.mock("/api/home/getChartData", "get", () => {
  return {
    code: 200,
    data: getChartData(),
    message: "请求成功",
  };
});
// 用户数据
Mock.mock("/api/user/getUserData", "get", userApi.getUserList);

Mock.mock(/user\/deleteUser/, "get", userApi.deleteUser);
Mock.mock(/user\/editUser/, "post", userApi.editUser);
Mock.mock(/user\/addUser/, "post", userApi.addUser);

Mock.mock(/permission\/getMenu/, "post", permissionApi.getMenu);
export default Mock;
