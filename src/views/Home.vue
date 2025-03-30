<template>
  <el-row class="home" :gutter="24">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img :src="menuStore.getImageUrl('user')" class="user" />
          <div class="user-info">
            <p class="admin">{{ userInfo.username }}</p>
            <p>{{ userInfo.email }}</p>
            <p>{{ userInfo.role }}</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间:<span>2022-7-11</span></p>
          <p>上次登录的地点:<span>北京</span></p>
        </div>
      </el-card>

      <el-card shadow="hover" class="table">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          >
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          v-for="item in CountData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
          shadow="hover"
        >
          <el-icon :style="{ background: item.color }" class="icons">
            <component :is="item.icon" />
          </el-icon>
          <div class="detail">
            <p class="num">{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card shadow="hover" class="top-echart">
        <div ref="echart" style="height: 300px"></div>
      </el-card>
      <div class="graph">
        <el-card shadow="hover">
          <div ref="userEchart" style="height: 230px"></div>
        </el-card>
        <el-card shadow="hover">
          <div ref="videoEchart" style="height: 230px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { useMenuStore } from "@/stores/pinia.js";
import home from "@/api/home"; // 直接导入 api 对象
import * as echarts from "echarts";
let tableData = ref([]);
let menuStore = useMenuStore();
let userInfo = ref({});
let CountData = ref({});

//observer 接收观察器实例对象
const observer = ref(null);
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  legend: {},
  grid: {
    left: "20%",
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
});

const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: [],
});
const { proxy } = getCurrentInstance();

//请求图表数据并渲染的方法
const getChartData = async () => {
  const data = await home.getChartData();
  const { orderData, userData, videoData } = data.data;
  await nextTick();

  //对第一个图表的xAxis和series赋值
  xOptions.xAxis.data = orderData.date;
  xOptions.series = Object.keys(orderData.data[0]).map((val) => ({
    name: val,
    data: orderData.data.map((item) => item[val]),
    type: "line",
  }));
  //one               echarts.init方法初始化ECharts实例，需要传入dom对象
  const OneEcharts = echarts.init(proxy.$refs["echart"]);
  //setOption方法应用配置对象
  OneEcharts.setOption(xOptions);

  //对第二个图表的xAxis和series赋值
  xOptions.xAxis.data = userData.map((item) => item.date);
  xOptions.series = [
    {
      name: "新增用户",
      data: userData.map((item) => item.new),
      type: "bar",
    },
    {
      name: "活跃用户",
      data: userData.map((item) => item.active),
      type: "bar",
    },
  ];
  //two
  const TwoEcharts = echarts.init(proxy.$refs["userEchart"]);
  TwoEcharts.setOption(xOptions);

  //对第三个图表的series赋值
  pieOptions.series = [
    {
      data: videoData,
      type: "pie",
    },
  ];
  //three
  const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"]);
  ThreeEcharts.setOption(pieOptions);

  //ResizeObserver 如果监视的容器大小变化，如果改变会执行传递的回调
  observer.value = new ResizeObserver((entries) => {
    OneEcharts.resize();
    TwoEcharts.resize();
    ThreeEcharts.resize();
  });
  //如果这个容器存在
  if (proxy.$refs["echart"]) {
    //则调用监视器的observe方法，监视这个容器的大小
    observer.value.observe(proxy.$refs["echart"]);
  }
};
const TableData = async () => {
  const data = await home.getTableData();
  tableData.value = data;
};

const UserInfo = async () => {
  const data = await home.getUserInfo();
  userInfo.value = data;
  console.log(data);
};
const CountData1 = async () => {
  const data = await home.getCountData();
  CountData.value = data;
  console.log(data);
};

onMounted(async () => {
  TableData();
  CountData1();
  UserInfo();
  await getChartData();
});
const tableLabel = ref({
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
});
</script>

<style lang="less" scoped>
.admin {
  font-size: 28px;
  font-weight: bold;
  color: #1218c4;
}
.home {
  height: 100%;
  overflow: hidden;
  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #d41b1b;
      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
  .table {
    margin-top: 20px;
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    }
  }
  .top-echart {
    height: 280px;
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
      height: 260px;
    }
  }
}
</style>
