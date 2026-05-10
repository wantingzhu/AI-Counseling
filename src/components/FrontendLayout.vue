<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image style="width: 40px; height: 40px" :src="brandImg" alt="logo" />
        <div class="brand-name">心理健康AI助手</div>
      </div>
      <div class="nav-section">
        <router-link to="/" exact class="nav-link active">首页</router-link>
        <router-link to="/ai-consult" exact class="nav-link" v-if="isLoggedIn">
          AI咨询
        </router-link>
        <router-link to="/emotion-log" exact class="nav-link" v-if="isLoggedIn">
          情绪日志
        </router-link>
        <router-link to="/knowledge-base" exact class="nav-link">知识库</router-link>
        <el-button v-if="isLoggedIn" class="logout-btn" @click="handleLogout"> 退出登录 </el-button>
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-content"><router-view></router-view></div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026 心理健康AI助手.保留所有权利.</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { logout } from "@/api/auth";
import { ElMessageBox, ElMessage } from "element-plus";

// 品牌图标路径
const brandImg = new URL("@/assets/images/机器人.png", import.meta.url).href;
const isLoggedIn = ref(localStorage.getItem("token") !== null);
const router = useRouter();

const handleLogout = () => {
  // 处理退出登录逻辑
  // 清除登录状态，跳转到登录页等
  ElMessageBox.confirm("确定退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    logout().then(() => {
      // 清除缓存
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      isLoggedIn.value = false;
      ElMessage.success("退出登录成功");
      router.push("/");
    });
  });
};
onMounted(() => {
  isLoggedIn.value = localStorage.getItem("token") !== null;
});
</script>
<style scoped lang="scss">
.frontend-layout {
  background-color: #fff;
  .navbar-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand-section {
      display: flex;
      align-items: center;
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          color: #4a90e2;
        }
      }
    }
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    margin-top: auto;
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
