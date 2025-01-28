import axios, { endpoints } from "./axios";
export const apiGetCredentialsFromAccessToken = (accessToken: string) =>
  axios({
    method: "get",
    url: endpoints.auth.getCredentialFromAccessToken + accessToken,
    withCredentials: false,
  });
export const apiGetProvinces = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.external.getProvinces + query,
  });
export const apiGetDistricts = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.external.getDistrictsFromIdProvince + query,
  });
export const apiGetWards = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.external.getWardsFromIdDistrict + query,
  });
