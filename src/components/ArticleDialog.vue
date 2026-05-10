<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="200"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类" clearable>
          <el-option
            v-for="item in props.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          type="textarea"
          v-model="formData.summary"
          placeholder="请输入文章摘要(可选)"
          maxlength="1000"
          show-word-limit
          :rows="4"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          type="textarea"
          v-model="formData.tagArray"
          placeholder="请输入文章标签(可选)"
          multiple
          filterable
          allow-create
          style="width: 100%"
        >
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload
            class="avatar-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            accept="image/*"
            :show-file-list="false"
          >
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面图片</p>
            </div>
            <img v-else :src="imgUrl" alt="封面图片" class="cover-image" />
          </el-upload>
          <div v-if="imgUrl" class="cover-remove">
            <el-button type="danger" size="small" @click="removeCover">移除封面</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容, 支持富文本格式, 可以使用加粗、斜体、列表、标题等格式来丰富文章内容"
          :maxCharCount="5000"
          min-height="400px"
          @change="handleContentChange"
          @created="handleEditorCreated"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">
        {{ btnPreview ? "隐藏效果" : "预览效果" }}
      </el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        {{ isEdit ? "更新文章" : "创建文章" }}
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="js">
import { computed, reactive, ref, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { fileUpload, articleCreate, articleUpdate } from "@/api/admin";
import { FILE_BASE_URL } from "@/config/index";
import RichTextEditor from "./RichTextEditor.vue";

// const dialogVisible = ref(false);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  article: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["update:modelValue", "success"]);
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isEdit = computed(() => !!props.article?.id);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (!isEdit.value) {
        imgUrl.value = "";
        Object.assign(formData, {
          title: "",
          content: "",
          coverImage: "",
          categoryId: "",
          summary: "",
          tags: "",
          id: "",
        });
      }
    }
  },
);

watch(
  () => props.article,
  (newVal) => {
    if (newVal && isEdit.value) {
      Object.assign(formData, newVal);
      businessId.value = newVal.id;
      imgUrl.value = newVal.coverImage ? FILE_BASE_URL + newVal.coverImage : "";
    }
  },
);

const handleClose = () => {
  dialogVisible.value = false;
  // 重置表单
  formRef.value.resetFields();
  // 重置业务ID
  businessId.value = null;
  // 重置标签
  formData.tagArray = [];
  // 重置封面图片和数据
  removeCover();
};

const formData = reactive({
  title: "",
  content: "",
  coverImage: "",
  categoryId: "",
  summary: "",
  tags: "",
  id: "",
});

const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",
  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",
  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];

const rules = reactive({
  title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
  content: [
    { required: true, message: "请输入文章内容", trigger: "blur" },
    { max: 5000, message: "文章内容长度必须在100到5000之间", trigger: "blur" },
  ],
});

// 上传
const imgUrl = ref("");
const beforeUpload = (file) => {
  // 针对上传的文件进行检验
  // 1. 检查文件类型是否为图片
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("请上传图片文件");
    return false;
  }
  // 2. 检查文件大小是否超过1MB
  const maxSize = 1024 * 1024 * 5;
  if (file.size > maxSize) {
    ElMessage.error("图片文件不能超过5MB");
    return false;
  }
  return true;
};

// 上传请求
const businessId = ref("");
const handleUploadRequest = async ({ file }) => {
  // UUID生成
  businessId.value = crypto.randomUUID();
  const fileResult = await fileUpload(file, {
    businessId: businessId.value,
  });
  console.log(fileResult, "上传结果");
  if (fileResult && fileResult.data) {
    imgUrl.value = FILE_BASE_URL + fileResult.data.filePath;
    formData.coverImage = fileResult.data.filePath;
  } else {
    ElMessage.error("上传失败，未返回图片路径");
  }
};

// 移除封面
const removeCover = () => {
  imgUrl.value = "";
  formData.coverImage = "";
};

// 富文本内容改变时触发
const handleContentChange = (data) => {
  console.log(data, "富文本内容改变");
  formData.content = data.html;
};
// 存储富文本实例
const editorInstance = ref(null);

// 富文本编辑器创建时触发
const handleEditorCreated = (editor) => {
  editorInstance.value = editor;
  if (formData.content && editor) {
    nextTick(() => {
      editor.setHtml(formData.content);
    });
  }
};

const btnPreview = ref(false);
// 提交
const formRef = ref();
const loading = ref(false);
const handleSubmit = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
    }
    console.log(formData, "提交表单数据");
    const submitData = {
      ...formData,
      tags: (formData.tagArray || []).join(","),
    };
    delete submitData.tagArray;
    if (isEdit.value) {
      // 更新编辑
      articleUpdate(submitData.id, submitData).then(() => {
        loading.value = false;
        emit("success");
      });
    } else {
      // 新增
      submitData.id = businessId.value;
      articleCreate(submitData).then(() => {
        loading.value = false;
        emit("success");
        handleClose();
      });
    }
  });
};
</script>
<style scoped lang="scss">
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background-color: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  object-fit: cover;
}
</style>
