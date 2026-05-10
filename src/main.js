// 导入Vue的createApp函数
import { createApp } from "vue";
import { createPinia } from "pinia";
// 导入路由配置
import router from "./router";
// 导入Element Plus组件库
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 导入Element Plus图标库
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 导入Element Plus样式
import "element-plus/dist/index.css";
// 导入自定义样式
import "./assets/style.css";
// 导入根组件
import App from "./App.vue";

// 创建Vue应用实例
const app = createApp(App);
// 创建Pinia实例
const pinia = createPinia();

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 注册Pinia
app.use(pinia);
// 注册路由
app.use(router);
// 注册Element Plus，配置中文语言
app.use(ElementPlus, {
  locale: zhCn,
});
// 挂载应用到DOM
app.mount("#app");
