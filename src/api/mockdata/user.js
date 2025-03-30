import Mock from "mockjs";

// 获取请求参数，统一从 body 中获取
function param2Obj(config) {
  try {
    // 如果 body 存在且不为空
    if (config.body) {
      return JSON.parse(config.body);
    }
    return {};
  } catch (error) {
    console.error("参数解析失败:", error);
    return {};
  }
}

let List = [];
const count = 200;
//模拟200条用户数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      addr: Mock.mock("@county(true)"),
      "age|18-60": 1,
      birth: Mock.Random.date(),
      sex: Mock.Random.integer(0, 1),
    })
  );
}

export default {
  /**
   * 获取列表
   * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getUserList: (config) => {
    console.log(config);

    const { name, page = 1, limit = 10 } = param2Obj(config);
    console.log("接收到的参数:", { name, page, limit }); // 添加日志

    const mockList = List.filter((user) => {
      if (name && user.name.indexOf(name) === -1) return false;
      return true;
    });

    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1)
    );

    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length,
      },
      msg: "获取成功",
    };
  },

  /**
   * 删除用户
   * @param id
   * @return {*}
   */
  deleteUser: (config) => {
    const { id } = param2Obj(config);

    if (!id) {
      return {
        code: -999,
        message: "参数不正确",
      };
    } else {
      List = List.filter((u) => u.id !== id);
      return {
        code: 200,
        message: "删除成功",
      };
    }
  },
  //编辑
  editUser: (config) => {
    const { id, name, addr, age, birth, sex } = param2Obj(config);
    console.log("编辑的参数", { id, name, addr, age });
    // 参数校验
    if (!id) {
      return {
        code: -999,
        message: "参数不正确",
      };
    }
    // 查找并更新用户
    const userIndex = List.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return {
        code: -999,
        message: "用户不存在",
      };
    }
    // 更新用户信息，保留未修改的字段
    List[userIndex] = {
      ...List[userIndex],
      name: name || List[userIndex].name,
      addr: addr || List[userIndex].addr,
      age: age || List[userIndex].age,
      birth: birth || List[userIndex].birth,
      sex: sex !== undefined ? sex : List[userIndex].sex,
    };
    return {
      code: 200,
      message: "编辑成功",
    };
  },
  //添加
  addUser: (config) => {
    const { name, addr, age, birth, sex } = param2Obj(config);
    //push到List
    List.push({
      id: Mock.Random.guid(),
      name,
      addr,
      age,
      birth,
      sex,
    });
    return {
      code: 200,
      message: "添加成功",
    };
  },
};
