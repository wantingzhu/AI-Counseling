import axios from "axios";
import { ElMessage } from "element-plus";

// 创建axios实例;
const service = axios.create({
  baseURL: "/api", //请求前缀
  timeout: 5000, //请求超时时间
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：添加token到请求头
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { data, config } = response;
    // console.log("响应数据:", data);
    // console.log("请求URL:", config.url);

    // 将 code 转换为数字以便比较
    const code = parseInt(data.code, 10);

    // 成功状态码是 200 ，根据实际情况调整
    if (code === 200 || data.success === true) {
      return data.data;
    } else {
      if (code === -1) {
        // 判断是否是登录/注册相关的请求
        const authUrls = ["/user/login", "/user/add", "/auth/register"];
        const isAuthRequest = authUrls.some((url) => config.url?.includes(url));

        if (isAuthRequest) {
          // 登录/注册失败，让组件自己处理错误
          return Promise.reject({ msg: data.msg, code: data.code });
        } else {
          ElMessage.error(data.msg || "登录过期，请重新登录");
          // 清除掉登录信息
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          window.location.href = "/auth/login";
          return Promise.reject(data.msg || "登录过期");
        }
      } else {
        ElMessage.error(data.msg || "请求失败");
        return Promise.reject(data.msg || "请求失败");
      }
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default service;
