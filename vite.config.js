import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      //自动引入
      imports: ["vue", "vue-router", "pinia"],
    }),
  ],
  //配置src目录别名@
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // 添加服务器代理配置
  server: {
    proxy: {
      // 配置代理
      "/api": {
        target: "http://127.0.0.1:4523/m1/6069469-5759728-default", // 目标服务器地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径
        secure: false, // 如果是https接口，需要配置这个参数
      },
      // 可以配置多个代理
      "/other-api": {
        target: "http://another-server.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/other-api/, "/api"),
      },
    },
    // 其他服务器配置
    host: "localhost", // 允许外部访问
    port: 3000, // 指定端口
    open: false, // 自动打开浏览器
  },
});
