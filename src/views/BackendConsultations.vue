<template>
  <div class="consultations-page">
    <ContentHead title="咨询记录"></ContentHead>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="回话ID" width="100">
        <template #default="scope">
          <el-avatar :size="40">{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪标签">
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-content">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="100" align="center">
      </el-table-column>
      <el-table-column prop="lastMessageTime" label="时间" width="150"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" text @click="viewSessionDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout=" total, prev, pager, next, jumper"
      :total="pagination.total"
      :page-size="pagination.size"
      v-model:current-page="pagination.currentPage"
      @current-change="handlePageChange"
      style="margin-top: 25px; float: right"
    />
    <el-dialog
      v-model="showDetailDialog"
      title="咨询会话详情"
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户:</div>
            <div class="detail-value">{{ sessionDetail.userNickname }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">时间:</div>
            <div class="detail-value">{{ sessionDetail.startedAt }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数:</div>
            <div class="detail-value">{{ sessionDetail.messageCount }}</div>
          </div>
        </div>
        <div class="messages-container">
          <div class="messages-header">
            <h4>对话记录</h4>
          </div>
          <div class="messages-list" v-loading="loadingMessages">
            <div
              v-for="msg in sessionMessages"
              :key="msg.id"
              class="message-item"
              :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
            >
              <div class="message-header">
                <span class="sender">{{ msg.senderType === 1 ? "用户" : "AI" }}</span>
                <span class="time">{{ msg.createdAt }}</span>
              </div>
              <div class="message-content">{{ msg.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="js">
import { ref, reactive, onMounted } from "vue";
import ContentHead from "@/components/ContentHead.vue";
import { consultationPage, getConsultationDetail } from "@/api/admin";

const tableData = ref([]);
// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const sessionDetail = ref({});
const sessionMessages = ref([]);
const loadingMessages = ref(false);

const viewSessionDetail = (row) => {
  loadingMessages.value = true;
  showDetailDialog.value = true;
  getConsultationDetail(row.id).then((res) => {
    loadingMessages.value = false;
    console.log(res);
    sessionMessages.value = res || [];
    sessionDetail.value = row;
  });
  console.log(row, "row");
};

const handlePageChange = (val) => {
  pagination.currentPage = val;
  handleSearch();
};

const handleSearch = () => {
  consultationPage(pagination).then((res) => {
    console.log(res, "咨询记录响应");
    const { records, total } = res || {};
    tableData.value = records || [];
    pagination.total = total || 0;
  });
};

// 详情弹窗
const showDetailDialog = ref(false);
onMounted(() => {
  handleSearch();
});
</script>
<style scoped lang="scss">
.session-detail {
  max-height: 70vh;
  overflow-y: auto;
  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    :last-child {
      margin-bottom: 0;
    }
    .detail-label {
      font-weight: 500;
      color: #495057;
      min-width: 80px;
      margin-right: 8px;
    }

    .detail-value {
      color: #333;
    }
  }
}
.messages-container {
  margin-top: 20px;
  .messages-header {
    margin-bottom: 16px;
    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .messages-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      :last-child {
        margin-bottom: 0;
      }
      &.user-message {
        background: #e8f4fd;
      }

      &.ai-message {
        background: #f0f9f0;
      }
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .sender {
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }

      .message-content {
        color: #333;
        line-height: 1.6;
        white-space: pre-wrap;
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
}
</style>
