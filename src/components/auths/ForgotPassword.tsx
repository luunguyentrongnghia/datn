import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { FormInput } from "../forms";
import { Button } from "../ui/button";
import { Input } from "antd";
import { apiRequestPwdOTP, apiVerifyPwdOTP } from "@/apis/auth";
import { toast } from "sonner";
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Trường này là bắt buộc." })
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      { message: "Phải là email hợp lệ." }
    ),
});
const formSchema2 = z.object({
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự." }),
  otp: z.string().min(6, { message: "Sai otp." }),
});
interface propForgotPassword {
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}
const ForgotPassword: React.FC<propForgotPassword> = ({
  setForgotPassword,
}) => {
  const [SetupPassword, setSetupPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });
  const form2 = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      password: "",
      otp: "",
    },
    mode: "onChange",
  });
  const handleRequestPwdOTP = async (data: any) => {
    const response = await apiRequestPwdOTP({ email: form.watch("email") });
    if (response.data.success) {
      toast.success(response.data.msg);
      setSetupPassword(true);
    } else {
      toast.error(response.data.msg);
    }
  };
  const handleVerifyPwdOTP = async (data: any) => {
    const response = await apiVerifyPwdOTP({
      email: form.watch("email"),
      otp: form2.watch("otp"),
      newPassword: form2.watch("password"),
    });
    if (response.data.success) {
      toast.success(response.data.msg);
      setForgotPassword(false);
    } else {
      toast.error(response.data.msg);
    }
  };
  return (
    <div>
      <h5 className="my-6 text-xl font-semibold">Quên mật khẩu</h5>
      <div className="text-start">
        {!SetupPassword && (
          <>
            <p className="text-slate-400 mb-6">
              Vui lòng nhập địa chỉ email của bạn để lấy lại mật khẩu
            </p>
            <Form {...form}>
              <form
                className="grid grid-cols-1"
                onSubmit={form.handleSubmit(handleRequestPwdOTP)}
              >
                <FormInput
                  form={form}
                  type="email"
                  label="Email"
                  name="email"
                  ClassNameInput="mt-3 w-full py-2 px-3 h-10 bg-transparen rounded outline-none border border-gray-300 focus:ring-0"
                  ClassNameLable="font-semibold text-black text-[15px]"
                  Placeholder="name@example.com or 0123456789"
                />

                <div className="mb-4">
                  <Button
                    type="submit"
                    variant={"destructive"}
                    className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full"
                  >
                    Xác nhận
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
        {SetupPassword && (
          <>
            <p className="text-slate-400 mb-6">
              Vui lòng kiểm tra địa chỉ email của bạn để lấy otp
            </p>
            <Form {...form2}>
              <form
                className="grid grid-cols-1"
                onSubmit={form.handleSubmit(handleVerifyPwdOTP)}
              >
                <FormInput
                  form={form2}
                  type="password"
                  label="Mật khẩu mới"
                  name="password"
                  ClassNameInput="mt-3 w-full py-2 px-3 h-10 bg-transparen rounded outline-none border border-gray-300 focus:ring-0"
                  ClassNameLable="font-semibold text-black text-[15px]"
                  Placeholder="Password"
                />
                <FormField
                  name="otp"
                  control={form2.control}
                  render={({ field }) => {
                    return (
                      <FormItem className="mb-4">
                        <FormLabel
                          className={"font-semibold text-black text-[15px]"}
                        >
                          Nhập OTP:
                        </FormLabel>

                        <FormControl>
                          <Input.Search
                            placeholder="nhập otp"
                            type="number"
                            allowClear
                            enterButton={
                              <button
                                type="button"
                                style={{
                                  backgroundColor:
                                    "rgb(239 68 68 / var(--tw-bg-opacity))",
                                  opacity: "1",
                                  color: "#fff",
                                  padding: "12px 10px",
                                  borderTopRightRadius: "6px",
                                  borderBottomRightRadius: "6px",
                                  cursor: "pointer",
                                }}
                                onClick={handleRequestPwdOTP}
                              >
                                Lấy otp
                              </button>
                            }
                            size="large"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="mb-4">
                  <Button
                    type="submit"
                    variant={"destructive"}
                    className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full"
                  >
                    Xác nhận
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
        <span className="text-slate-400 me-2 pt-3">Trở về đăng nhập</span>
        <span
          className="text-black dark:text-white font-bold cursor-pointer"
          onClick={() => {
            setForgotPassword(false);
          }}
        >
          Đăng nhập
        </span>
      </div>
    </div>
  );
};

export default ForgotPassword;
