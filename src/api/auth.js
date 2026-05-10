import service from "@/utils/request";

export const login = (data) => {
  return service.post("/user/login", data);
};
export const logout = () => {
  return service.post("/user/logout");
};
export const register = (data) => {
  return service.post("/user/add", data);
};
