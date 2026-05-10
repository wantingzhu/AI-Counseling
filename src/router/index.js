import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";
import AuthorLayout from "@/components/AuthorLayout.vue";
import FrontendLayout from "@/components/FrontendLayout.vue";

// 路由配置
// 登录注册路由
const authRoutes = [
  {
    path: "/auth",
    component: AuthorLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/ProLogin.vue"),
        meta: {
          title: "登录",
        },
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/views/ProRegister.vue"),
        meta: {
          title: "注册",
        },
      },
    ],
  },
];
// 后台路由
const backendRoutes = [
  {
    path: "/back",
    name: "backend",
    redirect: "/back/analysis",
    component: BackendLayout,
    children: [
      {
        path: "analysis",
        name: "analysis",
        component: () => import("@/views/BackendAnalysis.vue"),
        meta: {
          title: "数据分析",
          icon: "PieChart",
        },
      },
      {
        path: "knowledge",
        name: "knowledge",
        component: () => import("@/views/BackendKnowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineSquare",
        },
      },
      {
        path: "consultations",
        name: "consultations",
        component: () => import("@/views/BackendConsultations.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        path: "emotion",
        name: "emotion",
        component: () => import("@/views/BackendEmotion.vue"),
        meta: {
          title: "情绪日志",
          icon: "Sunny",
        },
      },
    ],
  },
];
// 前台路由
const frontendRoutes = [
  {
    path: "/",
    component: FrontendLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/ProHome.vue"),
      },
      {
        path: "ai-consult",
        name: "ai-consult",
        component: () => import("@/views/FrontendConsult.vue"),
      },
      {
        path: "emotion-log",
        name: "emotion-log",
        component: () => import("@/views/FrontendEmotion.vue"),
      },
      {
        path: "knowledge-base",
        name: "knowledge-base",
        component: () => import("@/views/FrontendKnowledge.vue"),
      },
      {
        path: "knowledge-base/article/:id",
        name: "knowledge-base-article",
        component: () => import("@/views/ArticleDetail.vue"),
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...backendRoutes, ...frontendRoutes],
});

// 路由的前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // 当前用户是否登录
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // 如果是后台用户
    if (userInfo.userType === 2) {
      if (to.path.startsWith("/back")) {
        next();
      } else {
        next("/back/analysis");
      }
    } else if (userInfo.userType === 1) {
      // 前端用户，不能访问后台页面
      if (to.path.startsWith("/back") || to.path.startsWith("/auth")) {
        next("/"); // 跳转到前端首页
      } else {
        next();
      }
    }
  } else {
    if (to.path.startsWith("/back")) {
      // 如果是访问后台页面，那么跳转到登录夜间
      next("/auth/login");
    } else {
      next();
    }
  }
});
export default router;
