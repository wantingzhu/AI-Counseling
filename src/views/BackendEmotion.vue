<template>
  <div class="emotion-page">
    <ContentHead title="情绪日志"></ContentHead>
    <div class="table-search">
      <TableSearch :formItem="formItem" @search="handleSearch" @reset="handleReset" />
    </div>
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="ID" width="80" prop="id" />
        <el-table-column label="会话ID" width="130">
          <template #default="scope">
            <el-avatar :size="40">{{ scope.row.nickname }}</el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="记录日期" width="120" prop="diaryDate" />
        <el-table-column label="情绪评分" width="210">
          <template #default="scope">
            <el-rate v-model="scope.row.moodScore" :max="10" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column label="生活指标" width="120">
          <template #default="scope">
            <div class="life-item sleep">睡眠: {{ scope.row.sleepQuality }}/5</div>
            <div class="life-item stress">压力: {{ scope.row.stressLevel }}/5</div>
          </template>
        </el-table-column>
        <el-table-column label="情绪触发因素" width="120" prop="emotionTriggers" />
        <el-table-column label="日记内容" width="220" prop="diaryContent" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" text @click="viewSessionDetail(scope.row)">详情</el-button>
            <el-button type="danger" text @click="deleteSession(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <EmotionDialog
      v-model:modelValue="dialogVisible"
      :currentDetail="currentDetail"
      :aiData="aiData"
    />
  </div>
</template>
<script setup lang="js">
import { ref, reactive, onMounted } from "vue";
import ContentHead from "@/components/ContentHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import EmotionDialog from "@/components/EmotionDialog.vue";
import { emotionPage, deleteEmotion } from "@/api/admin";
import { ElMessageBox, ElMessage } from "element-plus";

const formItem = [
  {
    comp: "input",
    prop: "userId",
    label: "用户ID",
    placeholder: "请输入用户ID",
    clearable: true,
  },
  {
    comp: "select",
    prop: "moodScoreRange",
    label: "情绪评分",
    placeholder: "请选择情绪评分范围",
    clearable: true,
    options: [
      { label: "低分(1-3)", value: "1-3" },
      { label: "中分(4-6)", value: "4-6" },
      { label: "高分(7-10)", value: "7-10" },
    ],
  },
];

// 列表数据
const tableData = ref([]);
// 分页参数
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页显示条数
  total: 0, // 总条数
});

/**
 * 搜索处理函数
 * @param {Object} formData - 表单数据
 */
const handleSearch = async (formData) => {
  // console.log(formData, "查询参数");
  // console.log(pagination, "分页参数");
  const params = {
    ...formData,
    ...pagination,
  };
  try {
    // 调用情绪日志列表接口
    const res = await emotionPage(params);
    console.log(res, "情绪日志列表响应");
    // 处理响应数据（响应拦截器已返回 data.data）
    if (res) {
      tableData.value = res.records || [];
      pagination.total = res.total || 0;
    }
  } catch (error) {
    console.error("获取文章列表失败:", error);
    tableData.value = [];
    pagination.total = 0;
  }
};
/**
 * 重置处理函数
 * @param {Object} formData - 表单数据
 */
const handleReset = (formData) => {
  console.log(formData, "重置参数");
  // 重置页码为第一页
  pagination.currentPage = 1;
  // 重新查询
  handleSearch({});
};
// 弹窗显示状态
const dialogVisible = ref(false);
const currentDetail = ref(null);
const aiData = ref(null);

/**
 * 查看会话详情
 * @param {Object} session - 会话数据
 */
const viewSessionDetail = (row) => {
  console.log("点击详情，行数据:", row);
  currentDetail.value = row;
  if (row.aiEmotionAnalysis) {
    aiData.value = JSON.parse(row.aiEmotionAnalysis);
  } else {
    aiData.value = {};
  }
  dialogVisible.value = true;
};

const deleteSession = (row) => {
  ElMessageBox.confirm("确认删除该记录吗？", "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "danger",
  }).then(() => {
    deleteEmotion(row.id).then(() => {
      ElMessage.success("删除成功");
      handleSearch({});
    });
  });
};
onMounted(() => {
  handleSearch({});
});
</script>
