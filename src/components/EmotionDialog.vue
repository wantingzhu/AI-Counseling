<template>
  <el-dialog title="情绪日志详情" v-model="dialogVisible" width="50%" @close="handleClose">
    <div v-if="props.currentDetail" class="detail-content">
      <div class="detail-section">
        <h4>用户信息</h4>
        <el-descriptions :column="2" border style="width: 100%" class="">
          <el-descriptions-item label="用户名">
            {{ props.currentDetail.username }}
          </el-descriptions-item>
          <el-descriptions-item label="昵称">
            {{ props.currentDetail.nickname }}
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">
            {{ props.currentDetail.userId }}
          </el-descriptions-item>
          <el-descriptions-item label="记录日期">
            {{ props.currentDetail.diaryDate }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="detail-section">
        <h4>情绪状态</h4>
        <el-descriptions :column="2" border style="width: 100%">
          <el-descriptions-item label="情绪评分">
            <el-rate :model-value="props.currentDetail.moodScore" :max="10" disabled />
          </el-descriptions-item>
          <el-descriptions-item label="主要情绪">
            <el-tag :type="getEmotionTagType(props.currentDetail.dominantEmotion)">
              {{ props.currentDetail.dominantEmotion }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="睡眠质量">
            {{ props.currentDetail.sleepQuality || "-" }}/5
          </el-descriptions-item>
          <el-descriptions-item label="压力水平">
            {{ props.currentDetail.stressLevel || "-" }}/5
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="detail-section">
        <h4>日记内容</h4>
        <el-descriptions :column="1" border style="width: 100%">
          <el-descriptions-item label="情绪触发因素">
            {{ props.currentDetail.emotionTriggers || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="日记内容">
            {{ props.currentDetail.diaryContent || "无" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div
        v-if="props.currentDetail.aiAnalysisStatus !== 'PENDING' && props.aiData"
        class="detail-section"
      >
        <div class="ai-analysis-result">
          <h4>AI情绪分析结果</h4>
          <el-descriptions :column="2" border style="width: 100%" class="ai-analysis-descriptions">
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getAiEmotionTagType(props.aiData.primaryEmotion)">
                {{ props.aiData.primaryEmotion }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪强度">
              <el-progress
                :percentage="props.aiData.emotionScore"
                :color="getEmotionScoreColor(props.aiData.emotionScore)"
                :stroke-width="8"
              />
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag :type="getRiskLevelTagType(props.aiData.riskLevel)">
                {{ getRiskLevelText(props.aiData.riskLevel) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪性质">
              <el-tag :type="props.aiData.isNegative ? 'danger' : 'success'">
                {{ props.aiData.isNegative ? "负面情绪" : "正面情绪" }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <div class="ai-suggestion-section">
            <h5>专业建议</h5>
            <div class="suggestion-content">
              {{ props.aiData.suggestion || "无" }}
            </div>
          </div>
          <div class="ai-risk-section">
            <h5>风险描述</h5>
            <div class="suggestion-content">
              {{ props.aiData.riskDescription || "无" }}
            </div>
          </div>
          <div class="ai-improvements-section">
            <h5>改善建议</h5>
            <ul class="improvement-list">
              <li v-for="item in props.aiData.improvementSuggestions" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <h4>时间信息</h4>
        <el-descriptions :column="2" border style="width: 100%">
          <el-descriptions-item label="创建时间">
            {{ props.currentDetail.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ props.currentDetail.updatedAt }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <!-- footer 必须是 el-dialog 的直接子元素 -->
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="js">
import { computed } from "vue";
// 映射
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    快乐: "success",
    平静: "info",
    兴奋: "warning",
    愤怒: "danger",
    悲伤: "info",
    焦虑: "warning",
  };
  return emotionTypes[emotion] || "info";
};
const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    快乐: "success",
    平静: "success",
    兴奋: "warning",
    满足: "success",
    愤怒: "danger",
    悲伤: "info",
    焦虑: "warning",
    恐惧: "danger",
    沮丧: "info",
    压力: "warning",
  };
  return emotionTagMap[emotion] || "info";
};

const getEmotionScoreColor = (score) => {
  if (score >= 80) return "#f56c6c";
  if (score >= 60) return "#e6a23c";
  if (score >= 40) return "#909399";
  return "#67c23a";
};

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: "success",
    1: "info",
    2: "warning",
    3: "danger",
  };
  return riskTagMap[riskLevel] || "info";
};

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: "正常",
    1: "关注",
    2: "预警",
    3: "危机",
  };
  return riskTextMap[riskLevel] || "未知风险等级";
};
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  currentDetail: {
    type: Object,
    default: null,
  },
  aiData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "success"]);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const handleClose = () => {
  emit("update:modelValue", false);
};
</script>
<style scoped lang="scss">
.detail-content {
  .detail-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;

      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;

    i {
      margin-right: 4px;
    }
  }

  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;

    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;

      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }

  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }

  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }

  .improvement-list {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }

  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;

    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;

      i {
        margin-right: 4px;
      }
    }
  }

  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>
