import React, { useState } from "react";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { apiGetCredentialsFromAccessToken } from "@/apis/externals";
import { apiCheckNewUser, apiVerifyOtp } from "@/apis/auth";
import SetupPassword from "./SetupPassword";
import useMeStore from "@/zustand/useMeStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import OtpVerifier from "../Otp/OtpVerifier";
import ForgotPassword from "./ForgotPassword";

const Auth = () => {
  const [variant, setVariant] = useState<string>("SIGNIN");
  const [isSetupPassword, setIsSetupPassword] = useState(false);
  const [isForgotPassword, setForgotPassword] = useState(false);
  const [dataInput, setDataInput] = useState("");
  const [modal, setModal] = useState(false);
  const { setGoogleData, getMe } = useMeStore();
  const navigate = useNavigate();
  const toggleVariant = () => {
    if (variant == "SIGNIN") {
      setVariant("SIGNUP");
    } else {
      setVariant("SIGNIN");
    }
  };
  const handleSignInGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await apiGetCredentialsFromAccessToken(
        tokenResponse.access_token
      );
      if (response.status === 200) {
        setGoogleData({
          googleId: response.data.id,
          email: response.data.email,
          avatar: response.data.picture,
          fullname: response.data.name,
          emailVerified: response.data.verifield_email,
        });
        const user = await apiCheckNewUser(response.data.email);
        if (user.data.hasUser) {
          toast.success(user.data.msg);
          getMe();
          navigate(-1);
        } else {
          setIsSetupPassword(true);
        }
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error("đăng nhập ko thành công");
    },
  });
  const handleVerifyOtp = async (otp: string) => {
    try {
      const response = await apiVerifyOtp(otp);
      if (response.data.success) {
        setModal(false);
        toast.success(response.data.msg);
        setVariant("SIGNIN");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="md:h-screen py-36 flex items-center relative overflow-hidden zoom-image">
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-2"
        id="particles-snow"
      ></div>
      <div className="container relative z-3 flex justify-center">
        <div className="max-w-[400px] w-full m-auto p-6 bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-700 rounded-md">
          {!isSetupPassword && !isForgotPassword && (
            <>
              <h5 className="my-2 text-xl font-semibold">
                {variant == "SIGNIN" ? "Đăng Nhập" : "Đăng Ký"}
              </h5>
              <div className="text-start">
                {variant == "SIGNIN" ? (
                  <Login setForgotPassword={setForgotPassword} />
                ) : (
                  <Register setModal={setModal} setDataInput={setDataInput} />
                )}
                <div className=" text-center">
                  <div className="h-1 relative my-4">
                    <div className="w-full h-[1px] bg-stone-200"></div>
                    <div className="absolute top-[-12px] inset-0 bg-transparent w-fix">
                      <p className="px-2 w-fit mx-auto bg-white text-sm text-primary">
                        Hoặc
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSignInGoogle()}
                    variant={"grayWhite"}
                    className="py-2 px-5 gap-2 tracking-wide duration-500 text-base text-center border-2 border-gray-500 bg-gray-700  rounded-md w-full"
                  >
                    <i className="fa-brands fa-google"></i>
                    Đăng nhập bằng google
                  </Button>
                  <span className="text-slate-400 me-2 pt-3">
                    {variant == "SIGNIN"
                      ? " Bạn chưa có tài khoản ?"
                      : "Bạn đã có tài khoản"}
                  </span>
                  <span
                    onClick={toggleVariant}
                    className="text-black dark:text-white font-bold cursor-pointer"
                  >
                    {variant == "SIGNIN" ? "Đăng ký" : "Đăng nhập"}
                  </span>
                </div>
              </div>
            </>
          )}
          {isSetupPassword && <SetupPassword />}
          {isForgotPassword && (
            <ForgotPassword setForgotPassword={setForgotPassword} />
          )}
        </div>
      </div>
      <OtpVerifier
        dataInput={dataInput}
        setModal={setModal}
        modal={modal}
        cb={handleVerifyOtp}
      />
    </section>
  );
};
export default Auth;
