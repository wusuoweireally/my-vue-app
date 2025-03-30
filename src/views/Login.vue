<template>
  <div class="login-page">
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginFormRef"
      class="login-container"
    >
      <h2>后台管理系统</h2>

      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入账号"
          prefix-icon="User"
          size="large"
          @keyup.enter="handleSubmit"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          size="large"
          show-password
          @keyup.enter="handleSubmit"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          size="large"
          class="login-button"
          @click="handleSubmit"
        >
          {{ loading ? "登录中..." : "登录" }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import loginApi from "@/api/login.js";
import { useMenuStore } from "../stores/pinia.js";
const store = useMenuStore();
const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);

const loginForm = reactive({
  username: "admin",
  password: "admin",
});

const rules = {
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
  ],
};

const handleSubmit = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    loading.value = true;

    const res = await loginApi.getMenu(loginForm);
    if (res) {
      ElMessage.success("登录成功");
      // 使用store方法更新菜单并保存到localStorage
      store.updateMenuList(res.menuList);
      // 使用store方法保存token
      store.setToken(res.token);
      store.addMenu(router);

      router.push("/home");
    }
  } catch (error) {
    console.error("登录失败:", error);
    ElMessage.error("登录失败，请检查账号密码");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #abdcff 10%, #0396ff 100%);
}

.login-container {
  width: 400px;
  padding: 40px 35px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #2c3e50;
    font-weight: 600;
    font-size: 26px;
  }

  :deep(.el-input) {
    --el-input-hover-border: var(--el-color-primary);

    .el-input__wrapper {
      padding-left: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    }

    .el-input__prefix-inner {
      font-size: 18px;
    }
  }

  .login-button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border-radius: 8px;
    margin-top: 10px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(3, 150, 255, 0.4);
    }
  }

  .el-form-item {
    margin-bottom: 25px;
  }
}
</style>
