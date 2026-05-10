<template>
  <div class="content-head flex-box">
    <h3 class="page-title">{{ props.title }}</h3>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>
<script setup lang="js">
const props = defineProps({
  title: {
    type: String,
    default: "页面标题",
  },
});
</script>
<style scoped lang="scss">
.flex-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-head {
  margin-bottom: 20px;
  .page-title {
    font-size: 24px;
    color: #2d3748;
  }
}
</style>
