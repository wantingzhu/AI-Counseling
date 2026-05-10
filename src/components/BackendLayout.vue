<template>
  <!-- 后台布局组件 -->
  <div class="backend-layout">
    <!-- 容器布局 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapsed ? '64px' : '264px'">
        <Sidebar></Sidebar>
      </el-aside>
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header>
          <Navbar></Navbar>
        </el-header>
        <!-- 主要内容区域 -->
        <el-main class="main-content-wrapper">
          <!-- 路由视图，用于显示子路由内容 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="js">
// 导入侧边栏组件
import Sidebar from "./BackendSidebar.vue";
// 导入导航栏组件
import Navbar from "./BackendNavbar.vue";
// 导入状态管理模块
import { useAdminStore } from "@/stores/admin";
import { computed } from "vue";

// 初始化状态管理模块
const isCollapsed = computed(() => useAdminStore().isCollapse);
</script>

<style scoped lang="scss">
/* 布局样式 */
.backend-layout {
  height: 100vh;
  :deep(.el-container),
  :deep(.el-aside),
  :deep(.el-main) {
    height: 100%;
  }
  :deep(.el-header) {
    height: 74px !important;
  }
  :deep(.main-content-wrapper) {
    padding: 20px;
    background-color: #fff;
    min-height: calc(100% - 74px);
  }
}
</style>
