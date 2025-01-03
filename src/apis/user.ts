import axios, { endpoints } from "./axios";

export const apiGetMe = () =>
  axios({
    method: "get",
    url: endpoints.user.getMe,
  });
export const apiGetUserTotal = (data: any) =>
  axios({
    method: "get",
    url: endpoints.user.getUserTotal + `?status=${data}`,
  });
export const apiUpdateMe = (data: any) =>
  axios({
    method: "put",
    url: endpoints.user.updateMe,
    data,
  });
export const apigetUsers = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.user.getUserAdmin + `?${query}`,
  });
export const apiUpdateStatusUserAdmin = (id: string, data: object) =>
  axios({
    method: "put",
    url: endpoints.user.updateStatusUserAdmin + id,
    data,
  });
