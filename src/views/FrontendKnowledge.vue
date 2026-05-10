<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="bookImg" style="width: 60px; height: 60px" />
        <h1>心理健康知识库</h1>
      </div>
    </div>
    <div class="content">
      <!-- 左侧菜单 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div class="recommend-list">
          <div
            v-for="item in recommendList"
            :key="item.id"
            class="recommend-item"
            @click="gotoArticle(item.id)"
          >
            <h4>{{ item.title }}</h4>
            <p class="read-count">
              <el-icon><Histogram /></el-icon>
              阅读量：{{ item.readCount }}
            </p>
          </div>
        </div>
      </div>
      <!-- 文章列表 -->
      <div class="article-list">
        <div
          class="article-item"
          v-for="item in articleList"
          :key="item.id"
          @click="gotoArticle(item.id)"
        >
          <el-image :src="getImage(item.coverImage)" style="width: 240px; height: 150px" />
          <div class="info">
            <div class="title">
              <h3>{{ item.title }}</h3>
              <el-tag type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <div style="margin-top: 10px">
              <div class="flex-box">
                <el-icon><Avatar /></el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon><List /></el-icon>
                <span>{{ dayjs(item.updatedAt).format("YYYY-MM-DD") }}</span>
              </div>
            </div>
            <div style="margin-top: 20px">
              <div class="flex-box">
                <el-icon><Platform /></el-icon>
                <span>{{ item.readCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
        v-model:page-size="pagination.size"
        @current-change="getPageList"
      />
    </div>
  </div>
</template>
<script setup lang="js">
import { getKnowledgeArticleList } from "@/api/frontend";
import { onMounted, reactive, ref } from "vue";
import { FILE_BASE_URL } from "@/config/index";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
const router = useRouter();

// 品牌图标路径
const bookImg = new URL("@/assets/images/book.png", import.meta.url).href;

// 推荐阅读列表
const recommendList = ref([]);

// 右侧列表数据
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

// 文章列表
const articleList = ref([]);

// 获取列表数据
const getPageList = () => {
  const params = {
    sortField: "publishedAt",
    sortOrder: "desc",
    ...pagination,
  };
  getKnowledgeArticleList(params).then((res) => {
    // console.log(res);
    pagination.total = res.total;
    pagination.currentPage = res.current;
    pagination.size = res.size;
    articleList.value = res.records;
  });
};

// 获取文章列表
const getImage = (url) => {
  return url ? FILE_BASE_URL + url : "https://file.itndedu.com/psychology_ai.png";
};

// 跳转到知识库详情页面
const gotoArticle = (id) => {
  router.push({
    path: `/knowledge-base/article/${id}`,
  });
};
onMounted(() => {
  // 获取推荐阅读列表
  const params = {
    sortField: "readCount",
    sortOrder: "desc",
    currentPage: 1,
    size: 5,
  };
  getPageList();
  getKnowledgeArticleList(params).then((res) => {
    console.log(res);
    recommendList.value = res.records;
  });
});
</script>
<style scoped lang="scss">
.knowledge-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
  .flex-box {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
  .header-section {
    background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
    color: white;
    padding: 48px;
    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  .content {
    display: flex;
    gap: 20px;
    margin: 0 auto;
    width: 1200px;
    padding: 20px;
    .recommend-section {
      width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      padding: 15px;
      height: 400px;
      .section-title {
        font-size: 12;
        font-weight: 600;
        color: #374151;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .recommend-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .recommend-item {
          border-left: 4px solid #f59e0b;
          padding-left: 10px;
          cursor: pointer;
          .read-count {
            margin-top: 15px;
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
    .article-list {
      flex: 1;
      .article-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        .info {
          margin-left: 20px;
          .title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
  }
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
  }
}
</style>
