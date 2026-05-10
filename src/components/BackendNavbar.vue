<template>
  <div class="nav-bar flex-box">
    <div class="flex-box">
      <el-button plain @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{ route.meta.title }}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            width="40"
            class="avatar"
          ></el-avatar>
          <span class="el-dropdown-link">{{ userInfo?.username || "admin" }}</span>
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="js">
// import { ref } from "vue";
import { useAdminStore } from "@/stores/admin";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { logout } from "@/api/auth";

const router = useRouter();
const route = useRoute();

// 从 localStorage 获取用户信息
const getUserInfo = () => {
  const userInfoStr = localStorage.getItem("userInfo");
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr);
    } catch {
      return null;
    }
  }
  return null;
};

const userInfo = getUserInfo();

const handleCommand = (command) => {
  console.log(command);
  if (command === "logout") {
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
        ElMessage.success("退出登录成功");
        router.push("/auth/login");
      });
    });
  }
};

const handleCollapse = () => {
  useAdminStore().toggleCollapse();
};
</script>
<style scoped lang="scss">
.flex-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-bar {
  padding: 0 15px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;
  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
  .avatar {
    margin-right: 5px;
  }
}
</style>
