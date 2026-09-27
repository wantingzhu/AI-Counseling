<template>
  <div class="knowledge-page">
    <ContentHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </ContentHead>
    <div class="table-search">
      <TableSearch :formItem="formItem" @search="handleSearch" @reset="handleReset"> </TableSearch>
    </div>
    <div class="table-container">
      <el-table v-loading="tableLoading" :data="tableData" empty-text="暂无知识文章" style="width: 100%; margin-top: 25px">
        <el-table-column fixed="left" label="文章标题" width="375px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon style="margin-right: 5px"><Timer /></el-icon>
              <span>{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="160px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon style="margin-right: 5px"><Timer /></el-icon>
              <span>{{ scope.row.categoryName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="作者" prop="authorName" width="160px"> </el-table-column>
        <el-table-column label="阅读量" prop="readCount" width="120px"> </el-table-column>
        <el-table-column label="发布时间" prop="updatedAt" width="150px"> </el-table-column>
        <el-table-column label="操作" width="240px" fixed="right">
          <template #default="scope">
            <el-button text type="primary" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button
              text
              type="success"
              v-if="scope.row.status === 0 || scope.row.status === 2"
              @click="handlePublish(scope.row)"
            >
              发布
            </el-button>
            <el-button
              text
              type="warning"
              v-if="scope.row.status === 1"
              @click="handleOffline(scope.row)"
            >
              下线
            </el-button>
            <el-button text type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <DataState
        :loading="tableLoading"
        :error="tableError"
        :empty="!tableLoading && !tableError && tableData.length === 0"
        empty-text="暂无知识文章"
        @retry="handleSearch(lastSearchParams)"
      />
      <el-pagination
        layout=" total, prev, pager, next, jumper"
        :total="pagination.total"
        :page-size="pagination.size"
        v-model:current-page="pagination.currentPage"
        @current-change="handlePageChange"
        style="margin-top: 25px; float: right"
      />
    </div>
    <ArticleDialog
      v-model:modelValue="dialogVisible"
      :categories="categories"
      :article="currentArticle"
      @success="handleSuccess"
    />
  </div>
</template>
<script setup lang="js">
// 导入 Vue 组合式 API
import { onMounted, ref, reactive } from "vue";
// 导入自定义组件
import ContentHead from "@/components/ContentHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import DataState from "@/components/DataState.vue";
// 导入 API 接口
import {
  categoryTree,
  articlePage,
  getArticleDetail,
  changeArticleStatus,
  articleDelete,
} from "@/api/admin";
import ArticleDialog from "@/components/ArticleDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";

/**
 * 搜索表单配置
 * 动态生成搜索表单的配置项，支持 input 和 select 两种类型
 */
const formItem = ref([
  {
    comp: "input", // 组件类型
    prop: "title", // 字段名
    label: "文章标题", // 标签文本
    placeholder: "请输入标题搜索",
    clearable: true, // 是否显示清空按钮
  },
  {
    comp: "select",
    prop: "categoryId",
    label: "分类",
    placeholder: "请选择分类",
    clearable: true,
  },
  {
    comp: "select",
    prop: "status",
    label: "状态",
    placeholder: "请选择状态",
    clearable: true,
    options: [
      // 下拉选项
      { label: "草稿", value: 0 },
      { label: "已发布", value: 1 },
      { label: "已下线", value: 2 },
    ],
  },
]);

/**
 * 分页参数配置
 * 使用 reactive 创建响应式对象
 */
const pagination = reactive({
  currentPage: 1, // 当前页码
  size: 10, // 每页条数
  total: 0, // 总记录数
});

/**
 * 表格数据
 * 使用 ref 创建响应式数组
 */
const tableData = ref([]);
const tableLoading = ref(false);
const tableError = ref(false);
const lastSearchParams = ref({});

/**
 * 分类列表数据（用于新增弹窗）
 */
const categories = ref([]);

/**
 * 搜索处理函数
 * @param {Object} formData - 表单数据
 */
const handleSearch = async (formData = lastSearchParams.value) => {
  lastSearchParams.value = { ...(formData || {}) };
  tableLoading.value = true;
  tableError.value = false;
  // console.log(formData, "查询参数");
  console.log(pagination, "分页参数");
  const params = {
    ...formData,
    ...pagination,
  };
  try {
    // 调用文章列表接口
    const res = await articlePage(params);
    console.log(res, "文章列表响应");
    // 处理响应数据（响应拦截器已返回 data.data）
    if (res) {
      tableData.value = res.records || [];
      pagination.total = res.total || 0;
    }
  } catch (error) {
    console.error("获取文章列表失败:", error);
    tableData.value = [];
    pagination.total = 0;
    tableError.value = true;
  } finally {
    tableLoading.value = false;
  }
};

/**
 * 重置处理函数
 * @param {Object} formData - 表单数据
 */
const handleReset = (formData) => {
  console.log(formData, "重置参数");
  // 重置页码为第一页
  pagination.currentPage = 1;
  // 重新查询
  handleSearch({});
};

/**
 * 分页处理函数
 * @param {Number} page - 新的页码
 */
const handlePageChange = (page) => {
  pagination.currentPage = page;
  handleSearch({});
};

/**
 * 组件挂载时执行
 * 初始化分类数据和文章列表
 */
// 新增和编辑文章弹窗
const dialogVisible = ref(false);
const currentArticle = ref(null);

/**
 * 成功处理函数
 * @param {Object} res - 成功响应数据
 */
const handleSuccess = () => {
  dialogVisible.value = false;
  // 刷新文章列表
  handleSearch({});
};

/**
 * 编辑文章处理函数
 * @param {Object} row - 文章行数据
 */
const handleEdit = (row) => {
  console.log(row, "编辑参数");
  if (!row.id) {
    // 新增
    currentArticle.value = {};
    dialogVisible.value = true;
  } else {
    // 编辑
    getArticleDetail(row.id).then((res) => {
      console.log(res, "文章详情");
      currentArticle.value = res || {};
      // 编辑文章时，将文章数据填充到弹窗中
      dialogVisible.value = true;
    });
  }
};
// 发布
const handlePublish = (row) => {
  ElMessageBox.confirm(`确认发布文章"${row.title}"吗？`, "确认", {
    confirmButtonText: "确定发布",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      changeArticleStatus(row.id, { status: 1 })
        .then(() => {
          ElMessage.success("发布成功");
          handleSearch(lastSearchParams.value);
        })
        .catch((err) => {
          ElMessage.error(err || "发布失败");
        });
    })
    .catch(() => {
      // 用户取消操作
    });
};
// 下线
const handleOffline = (row) => {
  ElMessageBox.confirm(`确认下线文章"${row.title}"吗？`, "确认", {
    confirmButtonText: "确定下线",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      changeArticleStatus(row.id, { status: 2 })
        .then(() => {
          ElMessage.success("下线成功");
          handleSearch(lastSearchParams.value);
        })
        .catch((err) => {
          ElMessage.error(err || "下线失败");
        });
    })
    .catch(() => {
      // 用户取消操作
    });
};
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除文章"${row.title}"吗？`, "确认", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "danger",
  })
    .then(() => {
      articleDelete(row.id)
        .then(() => {
          ElMessage.success("删除成功");
          handleSearch(lastSearchParams.value);
        })
        .catch((err) => {
          ElMessage.error(err || "删除失败");
        });
    })
    .catch(() => {
      // 用户取消操作
    });
};
onMounted(async () => {
  try {
    const res = await categoryTree();
    if (res && res.data) {
      const categoryList = res.data.map((item) => ({
        label: item.categoryName,
        value: item.id,
      }));
      formItem.value[1].options = categoryList;
      categories.value = categoryList;
      console.log(res, "分类树");
    }
  } catch (error) {
    console.error("获取分类树失败:", error);
  }
  handleSearch({});
});
</script>
