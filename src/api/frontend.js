import service from "@/utils/request";

export const createChatSession = (data) => {
  return service.post(`/psychological-chat/session/start`, data);
};
export const getSessionList = (params) => {
  return service.get(`/psychological-chat/sessions`, { params });
};
export const deleteChatSession = (sessionId) => {
  return service.delete(`/psychological-chat/sessions/${sessionId}`);
};
export const getChatSessionDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
};
export const getEmotionAnalysis = (sessionId) => {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`);
};
export const submitEmotionDiary = (data) => {
  return service.post(`/emotion-diary`, data);
};
export const getKnowledgeArticleList = (params) => {
  return service.get(`/knowledge/article/page`, { params });
};
export const getKnowledgeArticleDetail = (articleId) => {
  return service.get(`/knowledge/article/${articleId}`);
};
