import axios from "axios";
axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

axiosInstance.interceptors.response.use((response) => response);

export default axiosInstance;

export const endpoints = {
  auth: {
    getCredentialFromAccessToken:
      "https://www.googleapis.com/oauth2/v1/userinfo?access_token=",
    checkNewUser: "/users/has-user/",
    LoginWithGoogle: "/users/loginWithGoogle",
    register: "/users/register",
    verifyOtp: "/users/verifyOtp/",
    login: "/users/login",
    logout: "/users/logout",
    requestPwdOTP: "/users/requestPwdOtp",
    verifyPwdOTP: "/users/verifyPwdOTP",
    updatePaswordOtp: "/users/updatePaswordOtp",
    updatePasword: "/users/updatePasword",
  },
  user: {
    getMe: "/users/me/",
    updateMe: "/users/me/",
    getUserAdmin: "/users/",
    updateStatusUserAdmin: "/users/",
    getUserTotal: "/users/total/",
  },
  property: {
    getPropertyTypeAdmin: "/property-types/",
    createPropertyType: "/property-types/",
    updatePropertyType: "/property-types/",
    deletePropertyType: "/property-types/",
    createPackageTypeAdmin: "/package-type/",
    getPackageTypeAdmin: "/package-type/",
    updatePackageTypeAdmin: "/package-type/",
    deletePackageTypeAdmin: "/package-type/",
    createProperties: "/properties/",
    updateProperties: "/properties/",
    deleteProperties: "/properties/",
    getPropertiesImage: "/properties/getPropertyImage/",
    getPropertiesUser: "/properties/getPropertyUser/",
    getProperties: "/properties/",
    getPropertiesAdmin: "/properties/getPropertyAdmin",
    uploadImageProperties: "/properties/uploadImage",
    updateImageMain: "/properties/updateImageMain/",
    deleteImage: "/properties/deleteImage/",
    browsePost: "/properties/browsePost/",
    Unpost: "/properties/Unpost/",
    addPost: "/properties/addPost/",
    updateStatusExpired: "/properties/updateStatusExpired/",
    getPropertyTotal: "/properties/total/",
    createTitleDescAI: "/properties/createTitleDescAI",
  },
  Inquiries: {
    createInquiries: "/inquiries/",
    getInquiries: "/inquiries/",
    updateStatusInquiries: "/inquiries/",
    delete: "/inquiries/",
  },
  ReportProperty: {
    getReportProperty: "/report-property/",
    create: "/report-property/",
    update: "/report-property/",
    delete: "/report-property/",
  },
  transactions: "/transactions/",
  transactionsExcel: "/transactions/excel",
  getRevenueByMonth: "/transactions/ChartPayment",
  payment: "/payment/create",
  external: {
    getProvinces: `${import.meta.env.VITE_SERVER_URL}/province/findAll?`,
    getDistrictsFromIdProvince: `${
      import.meta.env.VITE_SERVER_URL
    }/district/findAll?`,
    getWardsFromIdDistrict: `${import.meta.env.VITE_SERVER_URL}/ward/findAll?`,
  },
};
