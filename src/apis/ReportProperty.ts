import axios, { endpoints } from "./axios";
export const apicreateReportProperty = (data: object) =>
  axios({
    method: "post",
    url: endpoints.ReportProperty.create,
    data,
  });
export const apigetReportProperty = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.ReportProperty.getReportProperty + `?${query}`,
  });
export const apiupdateStatusReportProperty = (id: string, data: any) =>
  axios({
    method: "put",
    url: endpoints.ReportProperty.update + id,
    data,
  });
export const apideletetReportProperty = (id: string) =>
  axios({
    method: "delete",
    url: endpoints.ReportProperty.delete + id,
  });
