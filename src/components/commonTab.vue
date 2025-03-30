<template>
  <div class="tags">
    <!--closable是否有关闭按钮,hoem标签不能关闭所以为false
            effect主题，找到当前路由对应的tab，设置'dark'高亮主题
        -->
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "@/stores/pinia.js";

const store = useMenuStore();
const route = useRoute();
const router = useRouter();
const tags = store.tags;
// const tags = computed(() => {
//   //这个在下面配置
//   return store.state.tags;
// });

const changeMenu = (tag) => {
  //单击tab时，联动面包屑
  store.selectMenu(tag);
  //跳转对应页面
  router.push(tag.name);
};

//关闭tab时触发
const handleClose = (tag, index) => {
  //关闭tab
  store.closeTag(tag, index);
  if (route.name !== tag.name) return;
  //如果关闭的是当前tab，跳转到上一个tab
  //关闭后跳转到上一个tab
  router.push(store.tags[index - 1].name);
};
</script>
<style lang="less" scoped>
.tags {
  margin: 20px 0 0 20px;
}
.el-tag {
  margin-right: 10px;
}
</style>
