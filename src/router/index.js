import { useMenuStore } from "@/stores/pinia";
import { createRouter, createWebHistory } from "vue-router";

//定制路由表
const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("@/views/Main.vue"),
    redirect: "/home",
    children: [],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  // 添加404页面路由
  {
    path: "/404",
    name: "notFound",
    component: () => import("@/views/NotFound.vue"),
  },
  // 捕获所有未匹配的路由
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];
//··创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const store = useMenuStore();
  const token = store.token;

  // 如果是登录页或404页面，直接放行
  if (to.path === "/login" || to.path === "/404") {
    next();
    return;
  }

  // 检查是否有token
  if (!token) {
    next("/login");
    return;
  }

  // 如果有token但没有路由，尝试恢复路由
  if (token && (!store.menuList || store.menuList.length === 0)) {
    store.initFromStorage();
    store.addMenu(router);
  }

  // 检查路由是否存在于菜单中
  const menuList = store.menuList;
  if (to.path !== "/home" && menuList && menuList.length > 0) {
    // 扁平化菜单路由，包括子菜单
    const allRoutes = flattenRoutes(menuList);

    // 检查请求的路径是否存在于菜单中
    const routeExists = allRoutes.some((route) => route.path === to.path);

    if (!routeExists && to.name !== "notFound") {
      next("/404");
      return;
    }
  }

  next();
});

// 辅助函数：扁平化路由，包含子路由
function flattenRoutes(routes) {
  let flatRoutes = [];

  routes.forEach((route) => {
    flatRoutes.push(route);

    if (route.children && route.children.length > 0) {
      flatRoutes = flatRoutes.concat(route.children);
    }
  });

  return flatRoutes;
}
//暴露路由实例
export default router;
