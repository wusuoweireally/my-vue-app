<template>
  <div class="header">
    <div class="l-content">
      <el-button @click="menuStore.toggleMenu">
        <el-icon class="icons"><Menu /></el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="current" :to="{ path: current.path }">{{
          current.label
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar
            class="user"
            :src="menuStore.getImageUrl('user')"
          ></el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="Logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
// import { ref } from "vue";
// import { computed } from "vue";
import { useMenuStore } from "@/stores/pinia.js";
import router from "../router";
import { ElMessage, ElMessageBox } from "element-plus";

let menuStore = useMenuStore();
const current = computed(() => menuStore.currentMenu);
const Logout = () => {
  ElMessageBox.confirm("确定退出登录吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    menuStore.logout();
    ElMessage.success("退出成功");

    router.push("/login");
  });
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #7adada;
}
.icons {
  //   background-color: transparent;
  margin-left: 10px;
  width: 20px;
  height: 20px;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
    background-color: transparent !important; /* 确保按钮背景颜色是透明的 */
    border: none; /* 移除按钮边框 */
    box-shadow: none; /* 移除按钮阴影 */
  }
}

:deep(.bread span) {
  cursor: pointer !important;
}
</style>
