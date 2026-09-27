<template>
  <div class="analysis-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card v-if="analyticsData.systemOverview">
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="usersIconUrl" alt="用户头像" style="width: 40px; height: 40px" />
            </div>
            <div class="info">
              <p class="title">用户数</p>
              <p class="value">{{ analyticsData.systemOverview.totalUsers || 0 }}</p>
              <p class="subtitle-title">
                活跃用户: {{ analyticsData.systemOverview.activeUsers || 0 }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analyticsData.systemOverview">
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="likeIconUrl" alt="点赞图标" style="width: 40px; height: 40px" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="value">{{ analyticsData.systemOverview.totalDiaries || 0 }}</p>
              <p class="subtitle-title">
                今日新增: {{ analyticsData.systemOverview.todayNewDiaries || 0 }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analyticsData.systemOverview">
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="commentsIconUrl" alt="评论图标" style="width: 40px; height: 40px" />
            </div>
            <div class="info">
              <p class="title">咨询回话</p>
              <p class="value">{{ analyticsData.systemOverview.totalSessions || 0 }}</p>
              <p class="subtitle-title">
                今日新增: {{ analyticsData.systemOverview.todayNewSessions || 0 }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analyticsData.systemOverview">
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="smileIconUrl" alt="微笑图标" style="width: 40px; height: 40px" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="value">{{ analyticsData.systemOverview.avgMoodScore || 0 }}/10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">情绪趋势分析</div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">咨询会话统计</div>
          </template>
          <div class="chart-content">
            <div class="consultation-stats" v-if="analyticsData.consultationStats">
              <div class="stat-item">
                <p class="stat-label">总会话数</p>
                <p class="stat-value">
                  {{ analyticsData?.consultationStats?.totalSessions || 0 }}
                </p>
              </div>
              <div class="stat-item">
                <p class="stat-label">平均时长</p>
                <p class="stat-value">
                  {{ analyticsData?.consultationStats?.avgDurationMinutes || 0 }}
                </p>
              </div>
              <div class="stat-item">
                <p class="stat-label">活跃用户</p>
                <p class="stat-value">
                  {{ analyticsData?.systemOverview?.activeUsers || 0 }}
                </p>
              </div>
            </div>
            <div ref="consultationChartRef" style="width: 100%; height: 260px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">用户活跃度趋势</div>
          </template>
          <div class="chart-content">
            <div ref="userActiveChartRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="js">
import { getAnalyticsOverview } from "@/api/admin";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

// import { ElMessage } from "element-plus";

let mycharts = null;

// 统计图片引入
const usersIconUrl = new URL("@/assets/images/users.png", import.meta.url).href;
const likeIconUrl = new URL("@/assets/images/like.png", import.meta.url).href;
const commentsIconUrl = new URL("@/assets/images/comments.png", import.meta.url).href;
const smileIconUrl = new URL("@/assets/images/smile.png", import.meta.url).href;

const analyticsData = ref({});

// 初始化图标
const initChart = () => {
  initEmotionChart();
  initConsultationChart();
  initUserActiveChart();
  nextTick(resizeCharts);
};
const resizeCharts = () => {
  emotionChart?.resize();
  consultationChart?.resize();
  userActiveChart?.resize();
};

const disposeCharts = () => {
  emotionChart?.dispose();
  consultationChart?.dispose();
  userActiveChart?.dispose();
  emotionChart = null;
  consultationChart = null;
  userActiveChart = null;
};

// 情绪趋势
let emotionChart = null;
const emotionChartRef = ref(null);

const initEmotionChart = () => {
  if (!emotionChartRef.value) return;
  // 销毁现有的图标
  if (emotionChart) {
    emotionChart.dispose();
  }
  // 创建echarts实例
  emotionChart = mycharts.init(emotionChartRef.value);
  // 获取情绪趋势的数据
  const emotionTrendData = analyticsData.value?.emotionTrend || [];

  // 配置项
  const option = {
    title: {
      text: "情绪趋势分析",
      textStyle: {
        color: "#2d3436",
        fontSize: 16,
        fontWeight: "bold",
      },
      left: "center",
      top: "10",
    },
    tooltip: {
      trigger: "axis",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
        fontSize: 14,
      },
    },
    legend: {
      data: ["平均情绪评分", "记录数量"],
      top: "40",
    },
    xAxis: {
      type: "category",
      data: emotionTrendData.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "#2d3436",
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "情绪评分",
        position: "left",
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
      {
        type: "value",
        name: "记录数量",
        position: "right",
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
    ],
    series: [
      {
        name: "平均情绪评分",
        type: "line",
        data: emotionTrendData.map((item) => item.avgMoodScore),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#faebaf",
        },
        itemStyle: {
          color: "#faebaf",
        },
      },
      {
        name: "记录数量",
        type: "line",
        data: emotionTrendData.map((item) => item.recordCount),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#eeb5a3",
        },
        itemStyle: {
          color: "#eeb5a3",
        },
      },
    ],
    // 控制容器的位置和大小
    grid: {
      left: "3%",
      right: "3%",
      top: "80",
      bottom: "3%",
    },
  };
  // 渲染图表
  emotionChart.setOption(option);
};

// 咨询会话统计
let consultationChart = null;
const consultationChartRef = ref(null);

const initConsultationChart = () => {
  if (!consultationChartRef.value) return;
  // 销毁现有的图标
  if (consultationChart) {
    consultationChart.dispose();
  }
  // 创建echarts实例
  consultationChart = mycharts.init(consultationChartRef.value);
  // 获取咨询会话统计的数据
  const consultationTrendData = analyticsData.value?.consultationStats?.dailyTrend || [];
  // 配置项
  const option = {
    title: {
      text: "咨询活动统计",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["会话数量", "参与用户数"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: consultationTrendData.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "会话数量",
        type: "bar",
        data: consultationTrendData.map((item) => item.sessionCount),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#74b9ff" },
              { offset: 1, color: "#0984e3" },
            ],
          },
        },
        barWidth: "40%",
      },
      {
        name: "参与用户数",
        type: "bar",
        data: consultationTrendData.map((item) => item.userCount),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#fdcb6e" },
              { offset: 1, color: "#f39c12" },
            ],
          },
        },
        barWidth: "40%",
      },
    ],
  };
  // 渲染图表
  consultationChart.setOption(option);
};

// 用户活跃度趋势
let userActiveChart = null;
const userActiveChartRef = ref(null);
const initUserActiveChart = () => {
  if (!userActiveChartRef.value) return;
  // 销毁现有的图标
  if (userActiveChart) {
    userActiveChart.dispose();
  }
  // 创建echarts实例
  userActiveChart = mycharts.init(userActiveChartRef.value);
  // 获取用户活跃度的数据
  const userActiveData = analyticsData.value?.userActivity || [];
  // 配置项
  const option = {
    title: {
      text: "用户活跃度趋势",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["活跃用户", "新增用户", "日记用户", "咨询用户"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: userActiveData.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "活跃用户",
        type: "line",
        data: userActiveData.map((item) => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#a29bfe",
        },
        itemStyle: {
          color: "#a29bfe",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(162, 155, 254, 0.4)" },
              { offset: 1, color: "rgba(162, 155, 254, 0.1)" },
            ],
          },
        },
      },
      {
        name: "新增用户",
        type: "line",
        data: userActiveData.map((item) => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fdcb6e",
        },
        itemStyle: {
          color: "#fdcb6e",
        },
      },
      {
        name: "日记用户",
        type: "line",
        data: userActiveData.map((item) => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#00b894",
        },
        itemStyle: {
          color: "#00b894",
        },
      },
      {
        name: "咨询用户",
        type: "line",
        data: userActiveData.map((item) => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fab1a0",
        },
        itemStyle: {
          color: "#fab1a0",
        },
      },
    ],
  };
  // 渲染图表
  userActiveChart.setOption(option);
};

onMounted(async () => {
  mycharts = await import("echarts");
  getAnalyticsOverview().then((res) => {
    console.log(res, "数据分析");
    analyticsData.value = res || {};
    initChart();
  });
  window.addEventListener("resize", resizeCharts);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeCharts);
  disposeCharts();
});
</script>
<style scoped lang="scss">
.analysis-container {
  .card-content {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 15px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }
    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }
      .value {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }
  .chart-content {
    padding: 20px;
    height: 300px;
    position: relative;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>
