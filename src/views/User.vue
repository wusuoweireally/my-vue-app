<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">+新增</el-button>
    <el-form :inline="true" :model="formInline" @submit.prevent>
      <el-form-item label="请输入">
        <el-input
          v-model="formInline.keyword"
          placeholder="请输入用户名"
          @keyup.enter.prevent="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="table">
    <el-table :data="list">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      />
      <el-table-column fixed="right" label="操作" min-width="180">
        <template #="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="config.page"
      v-model:page-size="config.limit"
      :page-sizes="[10, 20, 50, 100]"
      :total="config.total"
      background
      layout="total, sizes, prev, pager, next"
      class="pager"
    />
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    width="30%"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="form.age" type="number" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" :value="1" />
          <el-option label="女" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="birth">
        <el-date-picker
          v-model="form.birth"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="地址" prop="addr">
        <el-input v-model="form.addr" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import user from "@/api/user.js";
import { ElMessage, ElMessageBox } from "element-plus";
const formInline = reactive({
  keyword: "",
});

const dialogVisible = ref(false);
const formRef = ref();

// 监听 config.limit 的变化
const isEdit = ref(false);
const list = ref([]); //用户数据
const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: 200,
  },
  {
    prop: "addr",
    label: "地址",
    width: 400,
  },
]);

const form = reactive({
  id: "",
  name: "",
  age: "",
  sex: "",
  birth: "",
  addr: "",
});

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  age: [
    { required: true, message: "请输入年龄", trigger: "blur" },
    { type: "number", message: "年龄必须为数字" },
  ],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
  birth: [{ required: true, message: "请选择出生日期", trigger: "change" }],
  addr: [{ required: true, message: "请输入地址", trigger: "blur" }],
});
// 处理新增按钮点击
const handleAdd = () => {
  isEdit.value = false;
  dialogVisible.value = true;
  // 重置表单数据
  Object.assign(form, initialForm);
};
// 处理编辑按钮点击
const handleEdit = (row) => {
  isEdit.value = true;
  dialogVisible.value = true;
  // 复制用户数据到表单
  Object.keys(form).forEach((key) => {
    form[key] = row[key];
  });
};

// 处理对话框关闭
const handleClose = (done) => {
  ElMessageBox.confirm("确认关闭？")
    .then(() => {
      formRef.value?.resetFields();
      done();
    })
    .catch(() => {});
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    if (isEdit.value) {
      // 编辑用户
      await user.editUser(form);
      ElMessage.success("修改成功");
    } else {
      // 新增用户
      await user.addUser(form);
      ElMessage.success("添加成功");
    }

    dialogVisible.value = false;
    getUserData(); // 刷新列表
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};
//其中total是数据总条数，page是当前的页数，设置name根据name进行条件搜索
const config = reactive({
  name: "",
  page: 1,
  limit: 10,
  total: null,
});
const handleDelete = (val) => {
  //如果选择确定，就会执行then中的方法
  ElMessageBox.confirm("你确定删除吗?").then(async () => {
    await user.deleteUser({ id: val.id });
    //删除成功后弹出一个提示框
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    });
    //删除之后重新请求用户数据
    getUserData();
  });
};
const getUserData = () => {
  user
    .getUserData(config)
    .then((res) => {
      console.log(res);
      list.value = res.list.map((item) => {
        return {
          ...item,
          sexLabel: item.sex === 1 ? "男" : "女",
        };
      });
      config.total = res.count;
    })
    .catch((err) => {
      console.log(err, "获取用户数据失败");
    });
}; //获取用户数据
//新增用户

const handleSearch = () => {
  config.name = formInline.keyword;
  config.page = 1; // 搜索时重置页码
  getUserData();
}; //搜索用户
//这个方法之前定义过
watch(
  () => config.page,
  (newPage) => {
    if (newPage) {
      getUserData();
    }
  }
);
watch(
  () => config.limit,
  (newLimit) => {
    if (newLimit) {
      config.page = 1; // 切换每页条数时重置为第一页
      getUserData();
    }
  }
);
onMounted(() => {
  getUserData();
});
</script>
<style lang="less" scoped>
.user-header {
  display: flex;
  justify-content: space-between;
}

.table {
  position: relative;
  height: 470px;
  .pager {
    position: absolute;
    right: 0px;
    bottom: -50px;
  }
  .el-table {
    width: 100%;
    height: 100%;
  }
}
.select-clearn {
  display: flex;
}
</style>
