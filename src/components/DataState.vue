<template>
  <div v-if="loading || error || empty" class="data-state">
    <el-skeleton v-if="loading" :rows="rows" animated />
    <el-result
      v-else-if="error"
      icon="warning"
      title="加载失败"
      :sub-title="errorText"
    >
      <template #extra>
        <el-button type="primary" @click="$emit('retry')">重试</el-button>
      </template>
    </el-result>
    <el-empty v-else :description="emptyText" />
  </div>
</template>

<script setup lang="js">
defineEmits(["retry"]);

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  empty: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 4,
  },
  emptyText: {
    type: String,
    default: "暂无数据",
  },
  errorText: {
    type: String,
    default: "请检查网络后重试",
  },
});
</script>

<style scoped lang="scss">
.data-state {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}
</style>
