import { defineStore } from "pinia";

export const useMenuStore = defineStore("menu", () => {
  const isMenuCollapsed = ref(false);
  let currentMenu = ref(null);
  const tags = ref([
    {
      path: "/home",
      name: "home",
      label: "首页",
      icon: "home",
    },
  ]);
  const isCollapse = ref(false);
  const menuList = ref([]);
  const token = ref("");
  const routeList = ref([]);
  function toggleMenu() {
    isMenuCollapsed.value = !isMenuCollapsed.value;
  }

  const getImageUrl = (user) => {
    return new URL(`../assets/images/${user}.png`, import.meta.url).href;
  };

  function selectMenu(val) {
    if (val.name === "home") {
      currentMenu.value = null;
    } else {
      currentMenu.value = val;

      let index = tags.value.findIndex((item) => item.name === val.name);
      // 如果不存在则添加到tags中
      if (index === -1) {
        tags.value.push(val);
      }
    }
  }

  function closeTag(tag) {
    let index = tags.value.findIndex((item) => item.name === tag.name);
    tags.value.splice(index, 1);
  }

  function updateMenuList(val) {
    menuList.value = val;
    // 保存菜单数据到本地存储
    localStorage.setItem("menuList", JSON.stringify(val));
  }
  // 添加保存 token 的方法
  function setToken(val) {
    token.value = val;
    localStorage.setItem("token", val);
  }

  // 初始化函数，从本地存储恢复数据
  function initFromStorage() {
    const storedToken = localStorage.getItem("token");
    const storedMenuList = localStorage.getItem("menuList");

    if (storedToken) {
      token.value = storedToken;
    }

    if (storedMenuList) {
      try {
        menuList.value = JSON.parse(storedMenuList);
      } catch (error) {
        console.error("解析菜单数据失败:", error);
      }
    }
  }
  function addMenu(router, type) {
    if (!menuList.value || menuList.value.length === 0) {
      initFromStorage(); // 初始化状态
    }
    const menu = menuList.value;
    // 如果菜单列表为空，直接返回
    if (!menu || menu.length === 0) {
      return;
    }
    //这里**代表0或多个文件夹，*代表文件。就是把views下的文件全部导入
    const module = import.meta.glob("../views/**/*.vue");
    //这个是菜单格式化后的路由数组
    const routeArr = [];
    //格式化菜单路由
    menu.forEach((item) => {
      //如果菜单有children
      if (item.children) {
        //把children遍历格式化
        item.children.forEach((val) => {
          let url = `../views/${val.url}.vue`;
          //这里通过url取出对应的组件
          val.component = module[url];
        });
        //需要注意的是我们只需要为item.children中的菜单添加路由，所以我们把它解构出来
        routeArr.push(...item.children);
      } else {
        let url = `../views/${item.url}.vue`;
        item.component = module[url];
        routeArr.push(item);
      }
    });
    //遍历routeArr
    console.log("前", router.getRoutes());

    routeList.value = [];
    let routes = router.getRoutes();
    //删除所有的路由
    routes.forEach((item) => {
      if (item.name == "main" || item.name == "login") {
        return;
      } else {
        router.removeRoute(item.name);
      }
    });
    routeArr.forEach((item) => {
      //addRoute方法会返回一个函数，执行这个函数会把这个路由删除
      //这里我们把每一次router.addRoute添加路由的返回值收集起来，放到state中的routeList
      //addRoute第一个参数要添加子路由的路由name，第二个是一个路由记录
      routeList.value.push(router.addRoute("main", item));
    });
    console.log("后", router.getRoutes());
  }

  function logout() {
    // 清除token
    token.value = "";
    // 清除菜单数据
    menuList.value = [];

    // 清除本地存储
    localStorage.removeItem("token");
    localStorage.removeItem("menuList");

    // 清除动态路由
    routeList.value.forEach((removeFn) => removeFn());
    routeList.value = [];
  }
  return {
    isMenuCollapsed,
    addMenu,
    toggleMenu,
    getImageUrl,
    selectMenu,
    currentMenu,
    tags,
    isCollapse,
    closeTag,
    menuList,
    token,
    updateMenuList,
    setToken, // 导出新方法
    initFromStorage, // 导出初始化方法
    logout,
  };
});
