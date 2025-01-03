import { apiUpdatePasword, apiUpdatePaswordOtp } from "@/apis/auth";
import { FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useMeStore from "@/zustand/useMeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "antd";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
const formSchema = z
  .object({
    password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự." }),
    newPassword: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự." }),
    confirmNewPassword: z.string(),
    otp: z.string().min(6, { message: "Sai otp." }),
  })
  .refine(
    (data) => {
      const { newPassword, confirmNewPassword } = data;
      return newPassword === confirmNewPassword;
    },
    { message: "Mật khẩu không đúng.", path: ["confirmNewPassword"] }
  );
const UpdatePassword = () => {
  const { logout } = useMeStore();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
      otp: "",
    },
    mode: "onChange",
  });
  const handleUpdatePaswordOtp = async (data: any) => {
    const response = await apiUpdatePaswordOtp();
    if (response.data.success) {
      toast.success(response.data.msg);
    } else {
      toast.error(response.data.msg);
    }
  };
  const updateSubmit = async (data: any) => {
    const response = await apiUpdatePasword(data);
    if (response.data.success) {
      toast.success(response.data.msg);
      logout();
      navigate("/login");
    } else {
      toast.error(response.data.msg);
    }
  };
  return (
    <div className="transition-all duration-300">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(updateSubmit)}
          className="form-primary bg-white shadow-box-shadow-2 px-25px pt-10 pb-50px md:p-50px md:pt-10 "
        >
          <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color mb-30px">
            Đổi mật khẩu
          </h4>
          <div className="flex flex-col gap-30">
            <div className="relative">
              <FormInput
                form={form}
                label={"Mật khẩu củ"}
                name={"password"}
                Placeholder="Mật khẩu củ"
                type="password"
                ClassNameLable="font-semibold text-black text-[15px]"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
            </div>
            <div className="relative">
              <FormInput
                form={form}
                label={"Mật khẩu mới"}
                name={"newPassword"}
                Placeholder="Mật khẩu mới"
                type="password"
                ClassNameLable="font-semibold text-black text-[15px]"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
            </div>
            <div className="relative">
              <FormInput
                form={form}
                label={"Nhập lại mật khẩu mới"}
                name={"confirmNewPassword"}
                Placeholder="Mật khẩu mới"
                type="password"
                ClassNameLable="font-semibold text-black text-[15px]"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
            </div>
            <div className="relative">
              <FormField
                name="otp"
                control={form.control}
                render={({ field }: { field: any }) => {
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
                              onClick={handleUpdatePaswordOtp}
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
            </div>
            <div className="mt-4">
              <Button
                type="submit"
                variant={"destructive"}
                className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UpdatePassword;
