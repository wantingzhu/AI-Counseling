<template>
  <div class="login-container">
    <div class="login-title">
      <div class="back-home">
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <h2 class="title">登录您的账户</h2>
      <p class="description">请输入您的登录信息</p>
    </div>
    <div class="login-form">
      <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名或邮箱"
            size="large"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            size="large"
            type="password"
            show-password
            clearable
          />
        </el-form-item>
        <el-button class="login-btn" size="large" type="primary" @click="handleLogin(ruleFormRef)"
          >登录账户</el-button
        >
      </el-form>
    </div>
    <div class="go-register">
      <span>还没有账户？</span>
      <router-link to="/auth/register">去注册</router-link>
    </div>
  </div>
</template>
<script setup lang="js">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { login } from "@/api/auth";

// 获取路由实例
const router = useRouter();

// 表单数据
const ruleFormRef = ref();
const formData = reactive({
  username: "",
  password: "",
});

// 表单校验规则
const rules = reactive({
  username: [{ required: true, message: "请输入用户名或邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const handleLogin = async (formEl) => {
  if (!formEl) return;
  // 校验表单
  const valid = await formEl.validate();
  if (valid) {
    console.log(formData);
    // 校验通过，提交登录请求
    login(formData)
      .then((res) => {
        console.log("登录响应:", res);
        // 检查token是否存在（响应拦截器已返回data.data）
        if (!res || !res.token) {
          return console.error("登录失败");
        }
        // 登录成功保存用户信息和token到localStorage
        localStorage.setItem("token", res.token);
        localStorage.setItem("userInfo", JSON.stringify(res.userInfo));

        // 登录成功提示
        ElMessage.success("登录成功");

        // 根据用户类型跳转到不同页面
        if (res.userInfo.userType === 2) {
          router.push("/back/analysis");
        } else {
          router.push("/");
        }
      })
      .catch((error) => {
        // 登录失败提示
        console.error("登录错误:", error);
        ElMessage.error(error?.msg || error || "登录失败");
      });
  }
};
</script>
<style scoped lang="scss">
.flex-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  width: 384px;
  .login-title {
    .back-home {
      margin-bottom: 60px;
      span {
        margin-left: 3px;
      }
    }
    .title {
      text-align: center;
      margin-bottom: 10px;
      font-size: 36px;
    }
    .description {
      text-align: center;
      font-size: 18px;
      color: #6b7280;
    }
  }
  .login-form {
    margin-top: 30px;
    .login-btn {
      margin-top: 40px;
      width: 100%;
    }
  }
  .go-register {
    margin-top: 30px;
    text-align: center;
  }
}
</style>
