import service from "@/utils/request";

export const categoryTree = () => {
  return service.get("/knowledge/category/tree");
};
export const articlePage = (params) => {
  return service.get("/knowledge/article/page", { params });
};
export const fileUpload = (file, businessInfo) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessType ", "ARTICLE");
  formData.append("businessId ", businessInfo.businessId);
  formData.append("businessField", "cover");
  const token = localStorage.getItem("token");
  return service.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};
export const articleCreate = (data) => {
  return service.post("/knowledge/article", data);
};
export const getArticleDetail = (id) => {
  return service.get(`/knowledge/article/${id}`);
};
export const articleUpdate = (id, data) => {
  return service.put(`/knowledge/article/${id}`, data);
};
export const changeArticleStatus = (id, data) => {
  return service.put(`/knowledge/article/${id}/status`, data);
};
export const articleDelete = (id) => {
  return service.delete(`/knowledge/article/${id}`);
};
export const consultationPage = (params) => {
  return service.get("/psychological-chat/sessions", { params });
};
export const getConsultationDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
};
export const emotionPage = (params) => {
  return service.get("/emotion-diary/admin/page", { params });
};
export const deleteEmotion = (id) => {
  return service.delete(`/emotion-diary/admin/${id}`);
};
export const getAnalyticsOverview = () => {
  return service.get(`/data-analytics/overview`);
};
