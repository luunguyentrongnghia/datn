import axios, { endpoints } from "./axios";
export const apiPayment = (data: any) =>
  axios({
    method: "post",
    url: endpoints.payment,
    data,
  });
