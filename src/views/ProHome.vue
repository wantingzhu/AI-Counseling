<template>
  <div class="home-container">
    <div class="content">
      <div class="text">
        <h2 class="title">一次温暖的对话<br /><span class="highlight-text">化孤独为慰藉</span></h2>
        <p class="description">
          每个深夜，每个焦虑的时刻，我们都在这里，不必独自承受，让心与心的连接温暖你的每一天。
        </p>
        <div class="hero-actions">
          <el-button size="large" class="no-hover-btn">开始倾诉，获得陪伴</el-button>
          <el-button
            size="large"
            style="border-color: white; background-color: transparent; color: white"
          >
            记录心情，释放情绪
          </el-button>
        </div>
      </div>
      <div class="robot">
        <el-image style="width: 150px; height: 150px" :src="brandImg" alt="logo" />
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import { ref } from "vue";
// 品牌图标路径
const brandImg = new URL("@/assets/images/robot-fill.png", import.meta.url).href;
</script>
<style scoped lang="scss">
.home-container {
  background: linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%)
    rgba(74, 156, 140, 0.95);
  color: white;
  padding: 5rem 0;
  height: calc(100vh - 285px);
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    .text {
      width: 500px;
      .title {
        font-size: 45px;
        font-weight: bold;
        margin-bottom: 15px;
        line-height: 1.2;
        .highlight-text {
          color: #ffd700;
        }
      }
      .description {
        font-size: 17px;
        margin-bottom: 30px;
      }
      .hero-actions {
        .no-hover-btn {
          &:hover {
            background-color: var(--el-button-bg-color, #ffffff) !important;
            border-color: var(--el-button-border-color, #d9d9d9) !important;
            color: var(--el-button-text-color, #303133) !important;
            transform: none !important;
          }
        }
      }
    }
    .robot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.05) 100%
      );
      box-shadow:
        0 15px 35px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }
}
</style>
