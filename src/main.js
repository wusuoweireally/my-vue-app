import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/less/index.less";
//引入路由
import router from "./router/index.js";
//导入element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createPinia } from "pinia";
//引入图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { useMenuStore } from "./stores/pinia.js";
import "./api/mock.js";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia); // 先安装 pinia
const store = useMenuStore();
store.addMenu(router, "refresh");
// 初始化store中的状态
store.initFromStorage();
// 根据恢复的状态添加路由
if (store.token) {
  store.addMenu(router);
}
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);

app.use(router);

app.mount("#app");
