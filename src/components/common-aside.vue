<template>
  <el-aside :width="menuStore.isMenuCollapsed ? '64px' : '180px'">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      :router="true"
      :collapse="menuStore.isMenuCollapsed"
      text-color="#fff"
      :default-active="activeMenu"
    >
      <h3 v-show="!menuStore.isMenuCollapsed">通用后台管理系统</h3>
      <h3 v-show="menuStore.isMenuCollapsed">后台</h3>

      <!-- 没有子菜单的菜单项 -->
      <el-menu-item
        v-for="item in noChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenuClick(item)"
      >
        <component class="icons" :is="item.icon" />
        <span>{{ item.label }}</span>
      </el-menu-item>

      <!-- 有子菜单的菜单项 -->
      <el-sub-menu
        v-for="item in hasChildren"
        :key="item.path"
        :index="item.path"
      >
        <template #title>
          <component class="icons" :is="item.icon" />
          <span>{{ item.label }}</span>
        </template>

        <el-menu-item
          v-for="subItem in item.children"
          :key="subItem.path"
          :index="subItem.path"
          @click="handleMenuClick(subItem)"
        >
          <component class="icons" :is="subItem.icon" />
          <span>{{ subItem.label }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useMenuStore } from "@/stores/pinia.js";
import { useRouter } from "vue-router";
const router = useRouter();
const activeMenu = computed(() => router.path);

let menuStore = useMenuStore();
const list = computed(() => menuStore.menuList);
const handleMenuClick = (item) => {
  menuStore.selectMenu(item);
};
const noChildren = computed(() => list.value.filter((item) => !item.children));
const hasChildren = computed(() => list.value.filter((item) => item.children));
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
    transition: all 0.3s; /* 为标题添加过渡效果 */
  }
}
.icons {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.el-aside {
  height: 100%;
  background-color: #545c64;
  transition: width 0.3s ease-in-out; /* 添加宽度过渡效果 */
  overflow: hidden; /* 防止内容溢出 */
}
</style>
