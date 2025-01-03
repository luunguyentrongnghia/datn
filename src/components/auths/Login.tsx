import { apiLogin } from "@/apis/auth";
import { pathnames } from "@/lib/pathnames";
import { checkEmailOrPhone } from "@/lib/utils";
import useMeStore from "@/zustand/useMeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "../forms";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
const formSchema = () =>
  z.object({
    emailOrPhone: z
      .string()
      .min(1, { message: "Trường này là bắt buộc." })
      .refine(
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        { message: "Phải là email hợp lệ." }
      ),
    password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự." }),
  });
interface propLogin {
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}
const Login: React.FC<propLogin> = ({ setForgotPassword }) => {
  const { setToken, getMe } = useMeStore();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });
  const onSubmit = async (data: any) => {
    const { emailOrPhone, password } = data;
    const field = checkEmailOrPhone(emailOrPhone);
    if (!field) {
      console.error("Không phải email hoặc số điện thoại hợp lệ");
      return;
    }
    const response = await apiLogin({
      [field]: emailOrPhone,
      password,
    });
    if (response.data.success) {
      getMe();
      toast.success(response.data.msg);
      if (response.data.role === "admin") {
        navigate(pathnames.admin.Layout + pathnames.admin.dashboard);
      } else {
        navigate("/");
      }
    } else {
      toast.error(response.data.msg);
    }
  };
  return (
    <Form {...form}>
      <form className="grid grid-cols-1" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          form={form}
          type="email"
          label="Email"
          name="emailOrPhone"
          ClassNameInput="mt-3 w-full py-2 px-3 h-10 bg-transparen rounded outline-none border border-gray-300 focus:ring-0"
          ClassNameLable="font-semibold text-black text-[15px]"
          Placeholder="name@example.com or 0123456789"
        />
        <FormInput
          form={form}
          type="password"
          label="Mật khẩu"
          name="password"
          ClassNameInput="mt-3 w-full py-2 px-3 h-10 bg-transparen rounded outline-none border border-gray-300 focus:ring-0"
          ClassNameLable="font-semibold text-black text-[15px]"
          Placeholder="Password"
        />
        <div className="flex justify-between mb-4">
          <p className="text-slate-400 mb-0">
            <p
              className="text-slate-400 cursor-pointer"
              onClick={() => setForgotPassword(true)}
            >
              Quên mật khẩu ?
            </p>
          </p>
        </div>
        <div className="mb-4">
          <Button
            type="submit"
            variant={"destructive"}
            className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full"
          >
            Đăng nhập
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Login;
