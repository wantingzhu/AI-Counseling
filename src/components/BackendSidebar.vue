<template>
  <!-- 侧边栏菜单组件 -->
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo full-height"
    :collapse="isCollapsed"
    :collapse-transition="false"
  >
    <!-- 品牌信息区域 -->
    <div class="brand flex-box">
      <el-image class="brand-img" :src="brandImg" fit="contain" />
      <div class="brand-text" v-show="!isCollapsed">
        <h1 class="brand-title">心理健康AI助手</h1>
        <p class="brand-desc">管理后台</p>
      </div>
    </div>

    <!-- 菜单项列表 -->
    <el-menu-item
      @click="selectMenu(item.path)"
      v-for="item in backendRoutes"
      :key="item.path"
      :index="item.path"
    >
      <el-icon><component :is="item.meta.icon" /></el-icon>
      <span v-show="!isCollapsed">{{ item.meta.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="js">
// 导入Vue Router
import { useRouter } from "vue-router";

import { useAdminStore } from "@/stores/admin";
import { computed } from "vue";

// 后台菜单路由配置
const backendRoutes = [
  {
    path: "analysis",
    name: "analysis",
    meta: {
      title: "数据分析",
      icon: "PieChart",
    },
  },
  {
    path: "knowledge",
    name: "knowledge",
    meta: {
      title: "知识文章",
      icon: "ChatLineSquare",
    },
  },
  {
    path: "consultations",
    name: "consultations",
    meta: {
      title: "咨询记录",
      icon: "Message",
    },
  },
  {
    path: "emotion",
    name: "emotion",
    meta: {
      title: "情绪日志",
      icon: "Sunny",
    },
  },
];

// 初始化路由实例
const router = useRouter();

// 品牌图标路径
const brandImg = new URL("@/assets/images/机器人.png", import.meta.url).href;
const isCollapsed = computed(() => useAdminStore().isCollapse);

/**
 * 菜单选择函数
 * @param {string} key - 选中的菜单项路径
 */
const selectMenu = (key) => {
  // 跳转到选中的子路由
  router.push(`/back/${key}`);
};
</script>

<style scoped lang="scss">
/* 品牌信息区域样式 */
.full-height {
  height: 100%;
}
.flex-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;

  .brand-img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .brand-text .brand-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #1f2937;
  }

  .brand-text .brand-desc {
    font-size: 14px;
    font-weight: 400;
    color: #6b7280;
  }
}
</style>
