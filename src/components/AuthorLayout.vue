<template>
  <div class="auth-layout flex-box">
    <div class="left-section flex-box">
      <div class="content flex-box">
        <h2 class="title">心理AI助手</h2>
        <p class="description">
          每个深夜，每个焦虑的时刻，我们都在这里，不必独自承受，让心与心的连接温暖您的每一天
        </p>
        <div class="robot flex-box">
          <img :src="robotImg" alt="" />
        </div>
      </div>
    </div>
    <div class="right-section flex-box">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="js">
const robotImg = new URL("@/assets/images/robot-fill.png", import.meta.url).href;
</script>
<style scoped lang="scss">
.flex-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-layout {
  .left-section {
    flex: 1;
    background: linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%)
      rgba(74, 156, 140, 0.95);
    height: 100vh;
    .content {
      flex-direction: column;
      .title {
        margin-bottom: 20px;
        font-size: 40px;
        font-weight: bold;
        color: #fff;
      }
      .description {
        margin-bottom: 20px;
        width: 460px;
        font-size: 20px;
        color: #fff;
        text-align: center;
      }
      .robot {
        width: 160px;
        height: 160px;
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
        img {
          width: 90px;
          height: 90px;
        }
      }
    }
  }
  .right-section {
    flex: 1;
    height: 100vh;
    background-color: #fff;
  }
}
</style>
