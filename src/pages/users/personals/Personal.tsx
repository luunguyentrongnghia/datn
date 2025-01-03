import { apiUpdateMe } from "@/apis/user";
import { FormInput } from "@/components/forms";
import FormSelectAntd from "@/components/forms/FormSelectAntd";
import Image from "@/components/layous/Image";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { getBase64 } from "@/lib/fn";
import { generateDefaultAvatar } from "@/lib/utils";
import useAppStore from "@/zustand/useAppStore";
import useMeStore from "@/zustand/useMeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "antd";
import { FilePenLine } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = () =>
  z.object({
    avatar: z.union([z.instanceof(File), z.undefined(), z.null()]).optional(),
    fullname: z.string().optional(),
    address: z.string().optional(),
    province: z.union([z.string(), z.number(), z.undefined()]),
    district: z.union([z.string(), z.number(), z.undefined()]),
    ward: z.union([z.string(), z.number(), z.undefined()]),
  });
const Personal = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { me, getMe } = useMeStore();
  const [ReadOnlyInput, setReadOnlyInput] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>();
  const {
    provinces,
    getDistrictsFromIdProvince,
    getWardsFromIdDistrict,
    districts,
    wards,
  } = useAppStore();
  const form = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      fullname: "",
      address: "",
      avatar: undefined,
      province: "",
      district: "",
      ward: "",
    },
  });
  const selectedProvince = form.watch("province");
  const selectedDistrict = form.watch("district");
  useEffect(() => {
    if (form.watch("province") !== me?.province?.id) {
      handleProvinceChange(selectedProvince);
    }
  }, [selectedProvince]);
  useEffect(() => {
    if (form.watch("district") !== me?.district?.id) {
      handleDistrictChange(selectedDistrict);
    }
  }, [selectedDistrict]);
  useEffect(() => {
    if (me) {
      form.reset({
        fullname: me.fullname || "",
        address: me.address || "",
        province: me?.province?.id,
        district: me?.district?.id,
        ward: me?.ward?.id,
      });
    }
  }, [me]);
  const handleProvinceChange = async (value: string) => {
    form.setValue("district", "");
    form.setValue("ward", "");
    await getDistrictsFromIdProvince(value);
  };
  const handleDistrictChange = async (value: string) => {
    form.setValue("ward", "");
    await getWardsFromIdDistrict(value);
  };
  const handleImage = async (avatar: any) => {
    const avatarBase64 = await getBase64(avatar);
    setImageUrl(avatarBase64 as string);
    form.setValue("avatar", avatar);
  };
  const updateSubmit = async (data: any) => {
    console.log(data);
    const formData = new FormData();
    for (let key in data) {
      if (
        key === "avatar" &&
        data.avatar !== undefined &&
        data.avatar !== null
      ) {
        formData.append(key, data[key]); // Đảm bảo là file
      } else {
        formData.append(key, data[key]);
      }
    }
    const response = await apiUpdateMe(formData);
    if (response.data.id) {
      toast.success("Cập nhật thành công");
      getMe();
      setImageUrl("");
      setReadOnlyInput(true);
      setIsEdit(false);
    } else {
      toast.error("Lổi không thể cập nhật");
    }
  };
  return (
    <div className="transition-all duration-300">
      <div className="flex flex-col md:flex-row p-10 px-5 md:px-10 shadow-box-shadow-2">
        <div className="mr-0 md:mr-10 lg:mr-30px xl:mr-10 mb-[30px] md:mb-0">
          <Image
            fallbackSrc={generateDefaultAvatar(me.fullname)}
            src={me.avatar}
            className="max-full w-100px md:w-[180px] lg:w-[120px] xl:w-[180px]"
          />
        </div>
        <div>
          <h6 className="text-sm text-secondary-color font-bold mb-0">
            <span className="leading-1.3">Agent of Property</span>
          </h6>
          <h2 className="text-xl md:text-22px lg:text-26px xl:text-3xl text-heading-color font-bold mb-10px">
            <span className="leading-1.3 md:leading-1.3 xl:leading-1.3">
              {me.fullname}
            </span>
          </h2>
          <ul>
            <li>
              <p className="text-sm flex items-center gap-4 mt-2">
                <i className="fa-solid fa-map-location-dot text-sm"></i>
                <span className="leading-1.8">{me.address}</span>
              </p>
            </li>
            <li>
              <a
                className="text-sm flex items-center gap-4 mt-2"
                href="tel:+0123-456789"
              >
                <i className="fa-solid fa-phone"></i>
                <span className="leading-1.8">+0123-456789</span>
              </a>
            </li>
            <li>
              <a
                className="text-sm flex items-center gap-4 mt-2"
                href="mailto:example@example.com"
              >
                <i className="fa-solid fa-envelope"></i>
                <span className="leading-1.8"> {me.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(updateSubmit)}
          className="form-primary bg-white shadow-box-shadow-2 px-25px pt-10 pb-50px md:p-50px md:pt-10 "
        >
          <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color mb-30px">
            Thông tin cá nhân
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-30px">
            <div className="relative">
              <FormInput
                form={form}
                name={"fullname"}
                readOnly={ReadOnlyInput}
                Placeholder="Enter your name"
                type="text"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
              <span className="absolute top-[35%] -translate-y-1/2 right-4">
                <i className="fas fa-user text-sm lg:text-base text-secondary-color font-bold"></i>
              </span>
            </div>
          </div>
          <h2>Địa chỉ cá nhân:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-30px mt-4">
            <div className="relative">
              <FormInput
                form={form}
                name={"address"}
                readOnly={ReadOnlyInput}
                Placeholder="Enter your address"
                type="text"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
              <span className="absolute top-[35%] -translate-y-1/2 right-4">
                <i className="fa-solid fa-map-location-dot text-sm lg:text-base text-secondary-color font-bold"></i>
              </span>
            </div>
            <FormSelectAntd
              Placeholder="chọn Tỉnh/Thành phố"
              form={form}
              disabled={ReadOnlyInput}
              name="province"
              classSelect="text-paragraph-color outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              options={provinces.map((el) => ({
                label: el.name,
                value: el.id,
              }))}
            />
            <FormSelectAntd
              form={form}
              Placeholder="chọn Quận/Huyện"
              disabled={ReadOnlyInput}
              name="district"
              classSelect="text-paragraph-color  outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              options={districts.map((el) => ({
                label: el.name,
                value: el.id,
              }))}
            />
            <FormSelectAntd
              form={form}
              disabled={ReadOnlyInput}
              name="ward"
              Placeholder="chọn Phường/Xã"
              classSelect="text-paragraph-color  outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              options={wards.map((el) => ({
                label: el.name,
                value: el.id,
              }))}
            />
          </div>
          <h2>Tải ảnh avatar:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-30px mt-4">
            <FormField
              name="avatar"
              control={form.control}
              render={({ field }: { field: any }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Upload
                        name="avatar"
                        multiple
                        listType="picture-card"
                        showUploadList={false}
                        onChange={(value) =>
                          handleImage(value.file.originFileObj)
                        }
                        disabled={ReadOnlyInput}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="avatar"
                            style={{ width: "100%" }}
                          />
                        ) : (
                          <i className="fa-solid fa-plus"></i>
                        )}
                      </Upload>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="mt-5">
            {!isEdit && (
              <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                <Button
                  onClick={() => {
                    setIsEdit(true);
                    setReadOnlyInput(false);
                  }}
                  variant={"none"}
                  className="relative gap-2 z-1 px-30px lg:px-10 py-3 md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                >
                  <FilePenLine size={16} />
                  Cập nhật thông tin
                </Button>
              </h5>
            )}
            {isEdit && (
              <div className="flex gap-5">
                <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                  <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                  <Button
                    type="submit"
                    variant={"none"}
                    className="relative gap-2 z-1 px-30px lg:px-10 py-3 md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                  >
                    Cập nhật
                  </Button>
                </h5>
                <Button
                  onClick={() => {
                    setIsEdit(false);
                    setReadOnlyInput(true);
                    form.reset();
                  }}
                  variant={"none"}
                  className=" rounded-none lg:px-10 py-3 text-white bg-black uppercase"
                >
                  Hủy bỏ
                </Button>
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Personal;
