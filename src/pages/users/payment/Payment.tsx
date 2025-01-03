import { apiPayment } from "@/apis/payment";
import { FormInput } from "@/components/forms";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useMeStore from "@/zustand/useMeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Radio, Space } from "antd";
import clsx from "clsx";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = () =>
  z.object({
    money: z.number().min(1, { message: "trường này là bắt buộc." }),
    payment: z.string().min(1, { message: "Chọn phương thức nạp." }),
  });
const Payment = () => {
  const form = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      money: 0,
      payment: "",
    },
  });
  const { me, getMe } = useMeStore();
  const Payment = async (data: any) => {
    const response = await apiPayment({ amount: data.money });
    console.log(response);
    if (response.data.payUrl) {
      window.open(response.data.payUrl, "_blank");
    }
  };
  return (
    <div className="transition-all duration-300">
      <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color mb-30px ">
        Nạp tiền
      </h4>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(Payment)}
          className="form-primary bg-white border border-border-color-1 p-30px"
        >
          <FormInput
            form={form}
            name={"money"}
            ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
            label={"Nhập số tiền bạn muốn nạp (VND)"}
            type="text"
            formatNumber={true}
            ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
          />
          <label
            htmlFor="quickPrice"
            className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
          >
            Chọn nhanh:
          </label>
          <div id={"quickPrice"} className="grid grid-cols-3 grid-rows-2 gap-4">
            <div
              onClick={() => form.setValue("money", 500000)}
              className={clsx(
                "px-4 py-6 text-center border-2  rounded-md cursor-pointer",
                form.watch("money") === 500000
                  ? "border-red-500 bg-red-500/30"
                  : "border-gray-200 "
              )}
            >
              <h1>500,000 VNĐ</h1>
            </div>
            <div
              onClick={() => form.setValue("money", 1000000)}
              className={clsx(
                "px-4 py-6 text-center border-2  rounded-md cursor-pointer",
                form.watch("money") === 1000000
                  ? "border-red-500 bg-red-500/30"
                  : "border-gray-200 "
              )}
            >
              <h1>1,000,000 VNĐ</h1>
            </div>
            <div
              onClick={() => form.setValue("money", 2000000)}
              className={clsx(
                "px-4 py-6 text-center border-2  rounded-md cursor-pointer",
                form.watch("money") === 2000000
                  ? "border-red-500 bg-red-500/30"
                  : "border-gray-200 "
              )}
            >
              <h1>2,000,000 VNĐ</h1>
            </div>
            <div
              onClick={() => form.setValue("money", 3000000)}
              className={clsx(
                "px-4 py-6 text-center border-2  rounded-md cursor-pointer",
                form.watch("money") === 3000000
                  ? "border-red-500 bg-red-500/30"
                  : "border-gray-200 "
              )}
            >
              <h1>3,000,000 VNĐ</h1>
            </div>
            <div
              onClick={() => form.setValue("money", 5000000)}
              className={clsx(
                "px-4 py-6 text-center border-2  rounded-md cursor-pointer",
                form.watch("money") === 5000000
                  ? "border-red-500 bg-red-500/30"
                  : "border-gray-200 "
              )}
            >
              <h1>5,000,000 VNĐ</h1>
            </div>
            <div
              onClick={() => form.setValue("money", 10000000)}
              className={clsx(
                "px-4 py-6 text-center border-2  rounded-md cursor-pointer",
                form.watch("money") === 10000000
                  ? "border-red-500 bg-red-500/30"
                  : "border-gray-200 "
              )}
            >
              <h1>10,000,000 VNĐ</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-30px">
            <div>
              <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color mb-30px mt-50px">
                Phương thức nạp
              </h4>
              <FormField
                name="payment"
                control={form.control}
                render={({ field }: { field: any }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Radio.Group
                          className="border border-b-0 border-border-color-1 mb-30px w-full"
                          {...field}
                        >
                          <Space className="w-full" direction="vertical">
                            <Radio
                              className="border-b border-border-color-1 p-5 w-full text-base font-bold font-poppins "
                              value={"MOMO"}
                            >
                              <span>Thanh toán MoMo</span>
                              <img
                                className="ml-40 w-7 h-7 inline-block "
                                src="/public/momo.png"
                              />
                            </Radio>
                            <Radio
                              className=" border-b border-border-color-1 p-5 w-full text-base font-bold font-poppins"
                              value={"VnPay"}
                            >
                              VnPay
                            </Radio>
                            <Radio
                              className="border-b border-border-color-1 p-5 w-full text-base font-bold font-poppins"
                              value={"Paypal"}
                            >
                              Paypal
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div>
                <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                  <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                  <button
                    type="submit"
                    className="relative z-1 px-30px lg:px-10 py-3 md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                  >
                    Nạp tiền
                  </button>
                </h5>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-450px w-full">
                <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color mb-30px mt-50px">
                  Thông tin nạp
                </h4>
                <ul className="text-sm lg:text-base text-heading-color">
                  <li className="p-2 border-b border-border-color-17 bg-table-bg">
                    <div className="flex justify-between items-center">
                      <span className="leading-1.8 lg:leading-1.8">
                        Tài khoản chính:
                      </span>
                      <span className="leading-1.8 lg:leading-1.8">
                        {" "}
                        {me.balance} VNĐ
                      </span>
                    </div>
                  </li>

                  <li className="p-2 border-b border-border-color-17">
                    <div className="flex justify-between items-center">
                      <span className="leading-1.8 lg:leading-1.8">
                        Số tiền cộng vào TK chính:
                      </span>
                      <span className="leading-1.8 lg:leading-1.8">
                        {" "}
                        {form.watch("money")} VNĐ
                      </span>
                    </div>
                  </li>

                  <li className="p-2 border-b border-border-color-17 bg-table-bg">
                    <div className="flex justify-between items-center">
                      <span className="leading-1.8 lg:leading-1.8">
                        Phương thức nạp:
                      </span>
                      <span className="leading-1.8 lg:leading-1.8">
                        {" "}
                        {form.watch("payment")}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Payment;
