import { apiRegister } from "@/apis/auth";
import { checkEmailOrPhone } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "../forms";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
const formSchema = () =>
  z
    .object({
      emailOrPhone: z
        .string()
        .min(1, { message: "Trường này là bắt buộc." })
        .refine(
          (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^(?:\+84|0)(?:\d{9}|\d{8})$/;
            return emailRegex.test(value) || phoneRegex.test(value);
          },
          { message: "Phải là email hợp lệ hoặc số điện thoại hợp lệ." }
        ),
      fullname: z.string().min(1, { message: "Trường này là bắt buộc." }),
      password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự." }),
      confirmPassword: z
        .string()
        .min(6, { message: "Mật khẩu xác nhận tối thiểu 6 ký tự." }),
    })
    .refine(
      (data) => {
        const { password, confirmPassword } = data;
        return password === confirmPassword;
      },
      { message: "Mật khẩu không đúng.", path: ["confirmPassword"] }
    );
interface RegisterProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDataInput: React.Dispatch<React.SetStateAction<string>>;
}
const Register: React.FC<RegisterProps> = ({ setModal, setDataInput }) => {
  const form = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      emailOrPhone: "",
      password: "",
      fullname: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    const { emailOrPhone, password, fullname } = data;
    const field = checkEmailOrPhone(emailOrPhone);
    if (!field) {
      console.error("Không phải email hoặc số điện thoại hợp lệ");
      return;
    }
    setDataInput(field);
    const response = await apiRegister({
      [field]: emailOrPhone,
      password,
      fullname,
    });
    console.log("🚀 ~ onSubmit ~ response:", response);
    if (response.data.success) {
      setModal(true);
    } else {
      toast.error(response.data.msg);
    }
  };

  return (
    <Form {...form}>
      <form className="grid grid-cols-1" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          form={form}
          type="text"
          label="Email hoặc số điện thoại"
          name="emailOrPhone"
          ClassNameInput="mt-3 w-full py-2 px-3 h-10 bg-transparen rounded outline-none border border-gray-300 focus:ring-0"
          ClassNameLable="font-semibold text-black text-[15px]"
          Placeholder="name@example.com or 0123456789"
        />
        <FormInput
          form={form}
          type="text"
          label="Tên đầy đủ"
          name="fullname"
          ClassNameInput="mt-3 w-full py-2 px-3 h-10 bg-transparen rounded outline-none border border-gray-300 focus:ring-0"
          ClassNameLable="font-semibold text-black text-[15px]"
          Placeholder="Nguyễn Văn B"
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
        <FormInput
          form={form}
          type="password"
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          ClassNameInput="mt-3 w-full py-2 px-3 h-10 bg-transparen rounded outline-none border border-gray-300 focus:ring-0"
          ClassNameLable="font-semibold text-black text-[15px]"
          Placeholder="confirmPassword"
        />
        <div className="mb-4">
          <Button
            type="submit"
            variant={"destructive"}
            className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full"
          >
            Đăng ký
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Register;
