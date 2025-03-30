<template>
  <div class="not-found-container">
    <h1 class="error-code">404</h1>
    <div class="error-message">页面走丢了...</div>
    <div class="error-desc">抱歉，您访问的页面不存在</div>
    <el-button type="primary" @click="goHome">返回登录</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/login");
};
</script>

<style lang="less" scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  text-align: center;
}

.error-code {
  font-size: 120px;
  color: #409eff;
  margin: 0;
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.error-message {
  font-size: 24px;
  color: #303133;
  margin: 20px 0;
  font-weight: bold;
}

.error-desc {
  font-size: 16px;
  color: #909399;
  margin-bottom: 30px;
}
</style>
