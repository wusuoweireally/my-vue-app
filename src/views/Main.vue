<script setup>
import commonAside from "../components/common-aside.vue";
import commonHeader from "../components/commonHeader.vue";
import CommonTab from "../components/commonTab.vue";
</script>

<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <common-aside></common-aside>
      <el-container>
        <el-header class="header">
          <common-header></common-header>
        </el-header>
        <common-tab />

        <el-main class="right-main"> <router-view></router-view> </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.common-layout,
.lay-container {
  height: 100%;
}
.header {
  padding: 0;
}
</style>
