import {
  apicreateProperty,
  apiCreateTitleDescAI,
  apigetPropertyTypeAdmin,
  apiUploadImageProperty,
} from "@/apis/property";
import { FormInput } from "@/components/forms";
import FormSelectAntd from "@/components/forms/FormSelectAntd";
import MarkdownEditor from "@/components/forms/MarkdownEditor";
import useAppStore from "@/zustand/useAppStore";
import useMeStore from "@/zustand/useMeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, Image, Modal, Empty, Spin } from "antd";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
const formSchema = () =>
  z.object({
    property_type_id: z.string().min(1, { message: "trường này là bắt buộc." }),
    title: z.string().min(1, { message: "trường này là bắt buộc." }),
    description: z.string().min(1, { message: "trường này là bắt buộc." }),
    address: z.string().min(1, { message: "trường này là bắt buộc." }),
    Deposit_amount: z.string().optional(),
    Land_status: z.string().optional(),
    Road: z.string().optional(),
    balonDirection: z.string().optional(),
    direction: z.string().optional(),
    isFurniture: z.string().optional(),
    price: z.number().min(1, { message: "trường này là bắt buộc." }),
    Horizontal: z.string().optional(),
    Length: z.string().optional(),
    square_meter: z.string().min(1, { message: "trường này là bắt buộc." }),
    bathroom: z.string().optional(),
    bedroom: z.string().optional(),
    floor: z.string().optional(),
    Legal: z.string().optional(),
    province: z.number().min(1, { message: "trường này là bắt buộc." }),
    district: z.number().min(1, { message: "trường này là bắt buộc." }),
    ward: z.number().min(1, { message: "trường này là bắt buộc." }),
  });
interface propertyType {
  id: string;
  name: string;
  Deposit_amount: boolean;
  Land_status: boolean;
  Legal: boolean;
  Horizontal: boolean;
  Length: boolean;
  ResidentialArea: boolean;
  Road: boolean;
  bathroom: boolean;
  bedroom: boolean;
  balonDirection: boolean;
  direction: boolean;
  floor: boolean;
  isFurniture: boolean;
}
interface UploadedFile {
  error?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  name: string;
  originFileObj: File;
  uid: string;
  percent?: number;
  response?: string;
  size: number;
  status?: string;
  thumbUrl?: string;
  type: string;
  webkitRelativePath?: string;
}
type DataAiType = {
  PropertyTypeId: string;
  ward: string;
  district: string;
  province: string;
  square_meter: string;
  bathroom?: string;
  bedroom?: string;
  balonDirection?: string;
  direction?: string;
  Land_status?: string;
  Road?: string;
  isFurniture?: string;
  Horizontal?: string;
  Legal?: string;
  floor?: string;
  Deposit_amount?: string;
  Length?: string;
};
const CreatePost = () => {
  const { me, getMe } = useMeStore();
  const {
    setModal,
    provinces,
    getDistrictsFromIdProvince,
    getWardsFromIdDistrict,
    districts,
    wards,
    getPackageTypes,
  } = useAppStore();
  const form = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      listingType: "",
      Deposit_amount: "",
      Land_status: "",
      Legal: "",
      Horizontal: "0",
      Length: "0",
      ResidentialArea: "0",
      square_meter: "0",
      Road: "",
      bathroom: "0",
      bedroom: "0",
      balonDirection: "",
      direction: "",
      floor: "0",
      isFurniture: "",
      property_type_id: "",
      address: "",
      province: "",
      district: "",
      ward: "",
      description: "",
      title: "",
    },
  });
  const [PropertyType, setPropertyType] = useState<propertyType[]>([]);
  const [imageUrl, setImageUrl] = useState<UploadedFile[]>();
  const [InformationForm, setInformationForm] = useState<
    propertyType | undefined
  >();
  const selectedProvince = form.watch("province");
  const selectedDistrict = form.watch("district");
  const selectedPropertyType = form.watch("property_type_id");
  useEffect(() => {
    getPackageTypes();
  }, []);
  useEffect(() => {
    handleProvinceChange(selectedProvince);
  }, [selectedProvince]);
  useEffect(() => {
    handleDistrictChange(selectedDistrict);
  }, [selectedDistrict]);
  useEffect(() => {
    const inforForm = PropertyType.find(
      (item) => item.id === selectedPropertyType
    );
    setInformationForm(inforForm);
  }, [selectedPropertyType]);
  const handleProvinceChange = async (value: string) => {
    form.setValue("district", "");
    form.setValue("ward", "");
    await getDistrictsFromIdProvince(value);
  };
  const handleDistrictChange = async (value: string) => {
    form.setValue("ward", "");
    await getWardsFromIdDistrict(value);
  };
  const handlelistingType = async (data: any) => {
    const response = await apigetPropertyTypeAdmin(`listingType=${data}`);
    if (response.data) {
      setPropertyType(response.data.data);
    }
  };
  const handleImage = useCallback((imageData: any) => {
    setImageUrl(imageData);
  }, []);
  const handleRemove = (uid: string) => {
    setImageUrl((prevList) => prevList?.filter((item) => item.uid !== uid));
  };
  const updateSubmit = async (data: any) => {
    setModal(true, <Spin size="large" />);
    const response = await apicreateProperty(data);
    if (response.data.success && imageUrl?.length) {
      for (let i = 0; i < imageUrl.length; i++) {
        const formData = new FormData();
        formData.append("propertyId", response.data.data.id);
        formData.append("image", imageUrl[i].originFileObj);
        await apiUploadImageProperty(formData);
      }
    }
    form.reset();
    setModal(false);
    toast.success(response.data.msg);
  };
  const CreateAi = async () => {
    setModal(true, <Spin size="large" />);
    const isValid = await form.trigger([
      "province",
      "property_type_id",
      "district",
      "ward",
      "listingType",
      "square_meter",
    ]);
    if (isValid) {
      const provinceName = provinces.find(
        (option) => option.id === form.watch("province")
      );
      const districtName = districts.find(
        (option) => option.id === form.watch("district")
      );
      const wardName = wards.find((option) => option.id === form.watch("ward"));
      let dataAi: DataAiType = {
        PropertyTypeId: form.watch("property_type_id"),
        ward: wardName?.name || "",
        district: districtName?.name || "",
        province: provinceName?.name || "",
        square_meter: form.watch("square_meter"),
      };
      if (Number(form.watch("bathroom")) > 0) {
        dataAi.bathroom = form.watch("bathroom");
      }
      if (Number(form.watch("bedroom")) > 0) {
        dataAi.bedroom = form.watch("bedroom");
      }
      if (Number(form.watch("floor")) > 0) {
        dataAi.floor = form.watch("floor");
      }
      if (Number(form.watch("Horizontal")) > 0) {
        dataAi.Horizontal = form.watch("Horizontal");
      }
      if (Number(form.watch("Length")) > 0) {
        dataAi.Length = form.watch("Length");
      }
      if (form.watch("Length") !== "") {
        dataAi.isFurniture = form.watch("isFurniture");
      }
      if (form.watch("direction") !== "") {
        dataAi.direction = form.watch("direction");
      }
      if (form.watch("balonDirection") !== "") {
        dataAi.balonDirection = form.watch("balonDirection");
      }
      if (form.watch("Legal") !== "") {
        dataAi.Legal = form.watch("Legal");
      }
      if (form.watch("Road") !== "") {
        dataAi.Road = form.watch("Road");
      }
      if (form.watch("Land_status") !== "") {
        dataAi.Land_status = form.watch("Land_status");
      }
      if (form.watch("Deposit_amount") !== "") {
        dataAi.Deposit_amount = form.watch("Deposit_amount");
      }
      const response = await apiCreateTitleDescAI(dataAi);
      if (response.data.success) {
        const regex =
          /\*\*Tiêu đề\:\*\*\s*(.*?)\s*\n\*\*Mô tả\:\*\*\s*\n([\s\S]+)/;
        const match = response.data.data.match(regex);
        if (match) {
          form.setValue("title", match[1].trim());
          form.setValue("description", match[2].trim());
          toast.success(response.data.msg);
        } else {
          toast.success(response.data.msg);
        }
      } else {
        toast.success(response.data.msg);
      }
      setModal(false);
    }
  };
  return (
    <div className="transition-all duration-300 ">
      {me.status === "open" ? (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(updateSubmit)}
            className="form-primary add-property-form bg-white text-sm lg:text-base"
          >
            <div className="grid grid-cols-1 gap-30px mb-35px">
              <FormSelectAntd
                label="Hình thức:"
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                form={form}
                Placeholder="Hình thức mua bán \ cho thuê"
                handleChange={(data) => handlelistingType(data)}
                name="listingType"
                classSelect="text-paragraph-color w-[50%] outline-none h-[40px] block placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                options={[
                  { label: "bán", value: "bán" },
                  { label: "cho thuê", value: "cho thuê" },
                ]}
              />
              <FormSelectAntd
                label="Loại bất động sản:"
                Placeholder="loại Bất động sản:"
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                form={form}
                name="property_type_id"
                classSelect="text-paragraph-color w-[50%] outline-none h-[40px] block placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                options={PropertyType?.map((el) => ({
                  label: el.name,
                  value: el.id,
                }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-30px mb-35px">
              <FormInput
                form={form}
                name={"address"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Địa chỉ"}
                Placeholder="Nhập địa chỉ"
                type="text"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
              <FormSelectAntd
                Placeholder="chọn Tỉnh/Thành phố"
                form={form}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Tỉnh/Thành phố:"}
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
                name="district"
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Quận/Huyện:"}
                classSelect="text-paragraph-color  outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                options={districts.map((el) => ({
                  label: el.name,
                  value: el.id,
                }))}
              />
              <FormSelectAntd
                form={form}
                name="ward"
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Phường/Xã:"}
                Placeholder="chọn Phường/Xã"
                classSelect="text-paragraph-color  outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                options={wards.map((el) => ({
                  label: el.name,
                  value: el.id,
                }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-30px mb-35px bg-gray-100 p-4">
              <FormInput
                form={form}
                name={"price"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"giá"}
                type="text"
                formatNumber={true}
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
              <FormInput
                form={form}
                name={"square_meter"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Diện tích"}
                type="number"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
              {InformationForm?.direction && (
                <FormSelectAntd
                  form={form}
                  name="direction"
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px]"
                  label="Hướng chính:"
                  Placeholder="chọn hướng"
                  classSelect="text-paragraph-color outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                  options={[
                    { label: "Đông - Bắc", value: "Đông - Bắc" },
                    { label: "Tây - Nam", value: "Tây - Nam" },
                    { label: "Đông - Nam", value: "Đông - Nam" },
                    { label: "Tây - Bắc", value: "Tây - Bắc" },
                    { label: "Đông", value: "Đông" },
                    { label: "Tây", value: "Tây" },
                    { label: "Nam", value: "Nam" },
                    { label: "Bắc", value: "Bắc" },
                  ]}
                />
              )}
              {InformationForm?.balonDirection && (
                <FormSelectAntd
                  form={form}
                  name="balonDirection"
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px]"
                  label="Hướng ban công:"
                  Placeholder="chọn hướng"
                  classSelect="text-paragraph-color outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                  options={[
                    { label: "Đông - Bắc", value: "Đông - Bắc" },
                    { label: "Tây - Nam", value: "Tây - Nam" },
                    { label: "Đông - Nam", value: "Đông - Nam" },
                    { label: "Tây - Bắc", value: "Tây - Bắc" },
                    { label: "Đông", value: "Đông" },
                    { label: "Tây", value: "Tây" },
                    { label: "Nam", value: "Nam" },
                    { label: "Bắc", value: "Bắc" },
                  ]}
                />
              )}
              {InformationForm?.isFurniture && (
                <FormSelectAntd
                  form={form}
                  name="isFurniture"
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px]"
                  label="Nội thất:"
                  Placeholder="Nội thất"
                  classSelect="text-paragraph-color outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                  options={[
                    { label: "Cao cấp", value: "Cao cấp" },
                    { label: "Cơ bản", value: "Cơ bản" },
                    { label: "Full nội thất", value: "Full nội thất" },
                    { label: "Bàn giao thô", value: "Bàn giao thô" },
                    { label: "Nhà trống", value: "Nhà trống" },
                  ]}
                />
              )}
              {InformationForm?.Legal && (
                <FormSelectAntd
                  form={form}
                  name="Legal"
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px]"
                  label="Pháp lí:"
                  Placeholder="Pháp lí"
                  classSelect="text-paragraph-color outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                  options={[
                    { label: "Sổ hồng sẳn", value: "Sổ hồng sẳn" },
                    { label: "Đang chờ sổ", value: "Đang chờ sổ" },
                    { label: "Mua bán giấy tay", value: "Mua bán giấy tay" },
                    { label: "Hợp đồng mua bán", value: "Hợp đồng mua bán" },
                  ]}
                />
              )}
              {InformationForm?.Road && (
                <FormSelectAntd
                  form={form}
                  name="Road"
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px]"
                  label="Đường:"
                  Placeholder="Đường"
                  classSelect="text-paragraph-color outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                  options={[
                    { label: "Nhựa", value: "Nhựa" },
                    { label: "Bê tông", value: "Bê tông" },
                    { label: "Đất", value: "Đất" },
                  ]}
                />
              )}
              {InformationForm?.Land_status && (
                <FormSelectAntd
                  form={form}
                  name="Land_status"
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px]"
                  label="Tình trạng đất:"
                  Placeholder="Tình trạng đất"
                  classSelect="text-paragraph-color outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                  options={[
                    { label: "Đất có sẳn nhà", value: "Đất có sẳn nhà" },
                    { label: "Đất trống", value: "Đất trống" },
                    {
                      label: "Đất có cấy ăn trái",
                      value: "Đất có cấy ăn trái",
                    },
                    {
                      label: "Đất có cây công nghiệp",
                      value: "Đất có cây công nghiệp",
                    },
                    { label: "Đất trông hoa", value: "Đất trông hoa" },
                  ]}
                />
              )}
              {InformationForm?.Deposit_amount && (
                <FormSelectAntd
                  form={form}
                  name="Deposit_amount"
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px]"
                  label="Tiền cọc:"
                  Placeholder="Tiền cọc"
                  classSelect="text-paragraph-color outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                  options={[
                    { label: "1 tháng", value: "1 tháng" },
                    { label: "2 tháng", value: "2 tháng" },
                    { label: "3 tháng", value: "3 tháng" },
                    { label: "không cọc", value: "không cọc" },
                    { label: "Thỏa thuận", value: "Thỏa thuận" },
                  ]}
                />
              )}

              {InformationForm?.bedroom && (
                <FormInput
                  form={form}
                  name={"bedroom"}
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                  label={"Số phòng ngủ"}
                  type="number"
                  ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                />
              )}
              {InformationForm?.bathroom && (
                <FormInput
                  form={form}
                  name={"bathroom"}
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                  label={"Số phòng tắm"}
                  type="number"
                  ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                />
              )}
              {InformationForm?.floor && (
                <FormInput
                  form={form}
                  name={"floor"}
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                  label={"Số tầng"}
                  type="number"
                  ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                />
              )}
              {InformationForm?.ResidentialArea && (
                <FormInput
                  form={form}
                  name={"ResidentialArea"}
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                  label={"Diện tích đất thổ cư"}
                  type="number"
                  ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                />
              )}
              {InformationForm?.Horizontal && (
                <FormInput
                  form={form}
                  name={"Horizontal"}
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                  label={"Chiều ngang"}
                  type="number"
                  ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                />
              )}
              {InformationForm?.Length && (
                <FormInput
                  form={form}
                  name={"Length"}
                  ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                  label={"Chiều dài"}
                  type="number"
                  ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                />
              )}
            </div>
            <div className="grid grid-cols-1 gap-30px mb-35px">
              <div className="flex justify-end">
                <Button type="button" onClick={CreateAi}>
                  Tạo tiêu đề và mô tả bằng AI
                </Button>
              </div>
              <FormInput
                form={form}
                name={"title"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Tiêu đề"}
                Placeholder="Nhập Tiêu đề"
                type="text"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
              <MarkdownEditor
                form={form}
                name={"description"}
                label={"Mô tả:"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
              />
              <div className="w-full">
                <label
                  htmlFor="image"
                  className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                >
                  Tải ảnh:
                </label>
                <Upload
                  className="mt-2"
                  id="image"
                  multiple
                  listType="picture-card"
                  maxCount={5}
                  onChange={({ fileList }) => handleImage(fileList)} // Lấy file từ event
                  onRemove={({ uid }) => handleRemove(uid)}
                >
                  <div>
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </Upload>
                {imageUrl &&
                  imageUrl.map((url, index) => {
                    return (
                      <Image
                        key={index}
                        wrapperStyle={{ display: "none" }}
                        src={url.thumbUrl}
                        alt={`uploaded ${index}`}
                      />
                    );
                  })}
              </div>
            </div>

            <div>
              <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                <button
                  type="submit"
                  className="relative z-1 px-30px lg:px-10 py-3 md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                >
                  Tạo tin
                </button>
              </h5>
            </div>
          </form>
        </FormProvider>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Tài khoản của bạn đã bị khóa"
        />
      )}
    </div>
  );
};

export default CreatePost;
