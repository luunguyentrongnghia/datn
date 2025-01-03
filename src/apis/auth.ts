import axios, { endpoints } from "./axios";

export const apiCheckNewUser = (email: string) =>
  axios({
    method: "get",
    url: endpoints.auth.checkNewUser + email,
  });
export const apiLoginWithGoogle = (data: object) =>
  axios({
    method: "post",
    url: endpoints.auth.LoginWithGoogle,
    data,
  });
export const apiRegister = (data: object) =>
  axios({
    method: "post",
    url: endpoints.auth.register,
    data,
  });
export const apiLogout = () =>
  axios({
    method: "post",
    url: endpoints.auth.logout,
  });
export const apiVerifyOtp = (otp: string) =>
  axios({
    method: "put",
    url: endpoints.auth.verifyOtp + otp,
  });
export const apiLogin = (data: object) =>
  axios({
    method: "post",
    url: endpoints.auth.login,
    data,
  });
export const apiRequestPwdOTP = (data: object) =>
  axios({
    method: "post",
    url: endpoints.auth.requestPwdOTP,
    data,
  });
export const apiVerifyPwdOTP = (data: object) =>
  axios({
    method: "post",
    url: endpoints.auth.verifyPwdOTP,
    data,
  });
export const apiUpdatePaswordOtp = () =>
  axios({
    method: "post",
    url: endpoints.auth.updatePaswordOtp,
  });
export const apiUpdatePasword = (data: object) =>
  axios({
    method: "post",
    url: endpoints.auth.updatePasword,
    data,
  });
