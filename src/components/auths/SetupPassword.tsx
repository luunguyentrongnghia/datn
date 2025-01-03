import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormInput } from "../forms";
import { Form } from "../ui/form";
import useMeStore from "@/zustand/useMeStore";
import { apiLoginWithGoogle } from "@/apis/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z
  .object({
    password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự." }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      const { password, confirmPassword } = data;
      return password === confirmPassword;
    },
    { message: "Mật khẩu không đúng.", path: ["confirmPassword"] }
  );
const SetupPassword = () => {
  const { googleData } = useMeStore();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });
  const onSubmit = async (data: any) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    if (!googleData) {
      return alert("Toast lổi");
    }
    const payload = { ...googleData, password: data.password };
    const response = await apiLoginWithGoogle(payload);
    console.log("🚀 ~ onSubmit ~ response:", response);
    if (response.data.success) {
      toast.success(response.data.msg);
      navigate(-1);
    } else {
      toast.error(response.data.msg);
    }
  };
  return (
    <div>
      <h5 className="my-6 text-xl font-semibold">Thiết lập mật khẩu</h5>
      <div className="text-start">
        <Form {...form}>
          <form
            className="grid grid-cols-1"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
                Xác nhận
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SetupPassword;
