import axios, { endpoints } from "./axios";
export const apicreateInquiries = (data: object) =>
  axios({
    method: "post",
    url: endpoints.Inquiries.createInquiries,
    data,
  });
export const apigetInquiries = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.Inquiries.getInquiries + `?${query}`,
  });
export const apiupdateStatusInquiries = (id: string, data: any) =>
  axios({
    method: "put",
    url: endpoints.Inquiries.updateStatusInquiries + id,
    data,
  });
