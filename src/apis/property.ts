import axios, { endpoints } from "./axios";

export const apigetPropertyTypeAdmin = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.property.getPropertyTypeAdmin + `?${query}`,
  });
export const apicreatePropertyType = (data: object) =>
  axios({
    method: "post",
    url: endpoints.property.createPropertyType,
    data,
  });
export const apiupdatePropertyType = (data: object, id: string) =>
  axios({
    method: "put",
    url: endpoints.property.createPropertyType + id,
    data,
  });
export const apideletePropertyType = (data: any) =>
  axios({
    method: "delete",
    url: endpoints.property.deletePropertyType,
    data,
  });
export const apicreatePackageType = (data: object) =>
  axios({
    method: "post",
    url: endpoints.property.createPackageTypeAdmin,
    data,
  });
export const apigetPackageTypeAdmin = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.property.getPackageTypeAdmin + `?${query}`,
  });
export const apigetPackageTypeAll = () =>
  axios({
    method: "get",
    url: endpoints.property.getPackageTypeAdmin + "all",
  });
export const apigetPropertyTotal = (data: any) =>
  axios({
    method: "get",
    url: endpoints.property.getPropertyTotal + `?status=${data}`,
  });
export const apideletetPackageType = (data: any) =>
  axios({
    method: "delete",
    url: endpoints.property.deletePackageTypeAdmin,
    data,
  });
export const apiupdatePackageType = (data: object, id: string) =>
  axios({
    method: "put",
    url: endpoints.property.updatePackageTypeAdmin + id,
    data,
  });
export const apiupdateStatusExpired = (id: string) =>
  axios({
    method: "put",
    url: endpoints.property.updateStatusExpired + id,
  });
export const apicreateProperty = (data: object) =>
  axios({
    method: "post",
    url: endpoints.property.createProperties,
    data,
  });
export const apiUploadImageProperty = (data: any) =>
  axios({
    method: "post",
    url: endpoints.property.uploadImageProperties,
    data,
  });
export const apigetPropertyUser = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.property.getPropertiesUser + `?${query}`,
  });
export const apigetProperty = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.property.getProperties + `?${query}`,
  });
export const apigetPropertyDetail = (id: string) =>
  axios({
    method: "get",
    url: endpoints.property.getProperties + id,
  });
export const apigetPropertyAdmin = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.property.getPropertiesAdmin + `?${query}`,
  });
export const apiupdatePropertyUser = (data: object, id: string) =>
  axios({
    method: "put",
    url: endpoints.property.updateProperties + id,
    data,
  });
export const apigetPropertyImage = (id: string) =>
  axios({
    method: "get",
    url: endpoints.property.getPropertiesImage + id,
  });
export const apiUpdateImageMain = (data: object, id: string) =>
  axios({
    method: "put",
    url: endpoints.property.updateImageMain + id,
    data,
  });
export const apideletetIamge = (data: any) =>
  axios({
    method: "delete",
    url: endpoints.property.deleteImage,
    data,
  });
export const apideleteProperty = (id: string) =>
  axios({
    method: "delete",
    url: endpoints.property.deleteProperties + id,
  });
export const apiBrowsePost = (id: string) =>
  axios({
    method: "put",
    url: endpoints.property.browsePost + id,
  });
export const apiUnPost = (id: string, data: any) =>
  axios({
    method: "put",
    url: endpoints.property.Unpost + id,
    data,
  });
export const apiaddPost = (id: string, data: any) =>
  axios({
    method: "put",
    url: endpoints.property.addPost + id,
    data,
  });
export const apiCreateTitleDescAI = (data: any) =>
  axios({
    method: "post",
    url: endpoints.property.createTitleDescAI,
    data,
  });
