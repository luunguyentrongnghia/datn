import {
  apideletetIamge,
  apigetPropertyImage,
  apiUpdateImageMain,
  apiupdatePropertyUser,
  apiUploadImageProperty,
} from "@/apis/property";
import { FormInput } from "@/components/forms";
import FormSelectAntd from "@/components/forms/FormSelectAntd";
import MarkdownEditor from "@/components/forms/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { UpdatePostUserProp } from "@/lib/Interface";
import useAppStore from "@/zustand/useAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Switch, Table, Upload } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchemaProperty = () =>
  z.object({
    title: z.string().optional(),
    address: z.string().optional(),
    province: z.union([z.string(), z.number(), z.undefined()]),
    district: z.union([z.string(), z.number(), z.undefined()]),
    ward: z.union([z.string(), z.number(), z.undefined()]),
    price: z.string().optional(),
    square_meter: z.number().optional(),
    description: z.string().optional(),
    floor: z.number().optional(),
    bedroom: z.number().optional(),
    bathroom: z.number().optional(),
    isFurniture: z.string().optional(),
    direction: z.string().optional(),
    balonDirection: z.string().optional(),
    Road: z.string().optional(),
    Legal: z.string().optional(),
    Land_status: z.string().optional(),
    Deposit_amount: z.string().optional(),
    ResidentialArea: z.number().optional(),
    Horizontal: z.number().optional(),
    Length: z.number().optional(),
  });
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
const UpdatePost: React.FC<UpdatePostUserProp> = ({
  dataDefault,
  handleGetData,
}) => {
  const {
    provinces,
    getDistrictsFromIdProvince,
    getWardsFromIdDistrict,
    districts,
    wards,
  } = useAppStore();
  const [ImageProperty, setImageProperty] = useState([]);
  const [imageUrl, setImageUrl] = useState<UploadedFile[]>();
  const [loading, setLoading] = useState(true);
  const form = useForm({
    resolver: zodResolver(formSchemaProperty()),
    defaultValues: {
      description: dataDefault.description,
      price: dataDefault.price,
      title: dataDefault.title,
      Deposit_amount: dataDefault.Deposit_amount,
      Land_status: dataDefault.Land_status,
      Legal: dataDefault.Legal,
      Horizontal: dataDefault.Horizontal,
      Length: dataDefault.Length,
      ResidentialArea: dataDefault.ResidentialArea,
      square_meter: dataDefault.square_meter,
      Road: dataDefault.Road,
      bathroom: dataDefault.bathroom,
      bedroom: dataDefault.bedroom,
      balonDirection: dataDefault.balonDirection,
      direction: dataDefault.direction,
      floor: dataDefault.floor,
      isFurniture: dataDefault.isFurniture,
      address: dataDefault.address,
      province: dataDefault.province.id,
      district: dataDefault.district.id,
      ward: dataDefault.ward.id,
    },
  });
  const getImage = async (idProperty: string) => {
    setLoading(true);
    try {
      const response = await apigetPropertyImage(idProperty);
      if (response.data.success) {
        console.log(response.data.data);
        setImageProperty(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getImage(dataDefault.id);
  }, [dataDefault]);
  const selectedProvince = form.watch("province");
  const selectedDistrict = form.watch("district");
  useEffect(() => {
    handleProvinceChange(selectedProvince.toString());
  }, [selectedProvince]);
  useEffect(() => {
    handleDistrictChange(selectedDistrict.toString());
  }, [selectedDistrict]);
  const handleProvinceChange = async (value: string) => {
    // form.setValue("district", 0);
    // form.setValue("ward", 0);
    await getDistrictsFromIdProvince(value);
  };
  const handleDistrictChange = async (value: string) => {
    // form.setValue("ward", 0);
    await getWardsFromIdDistrict(value);
  };
  const updateSubmit = async (data: any) => {
    const response = await apiupdatePropertyUser(data, dataDefault.id);
    if (response.data.affected > 0) {
      toast.success("Cập nhật thành công");
      handleGetData();
    } else {
      toast.error("Lổi không thể cập nhật");
    }
  };
  const handleDeleteImage = async (id: string) => {
    const response = await apideletetIamge({ ids: id });
    if (response.data.affected > 0) {
      getImage(dataDefault.id);
      toast.success("Xóa thành công");
    } else {
      toast.success("Có lổi xảy ra");
    }
  };
  const handleUpdateMainImage = async (value: boolean, record: any) => {
    const response = await apiUpdateImageMain(
      {
        is_main: value,
        idProperty: record.propertyId,
      },
      record.id
    );
    if (response.data.success) {
      toast.success(response.data.msg);
      getImage(dataDefault.id);
    }
  };
  const handleImage = useCallback((imageData: any) => {
    setImageUrl(imageData);
  }, []);
  const handleRemove = (uid: string) => {
    setImageUrl((prevList) => prevList?.filter((item) => item.uid !== uid));
  };
  const addImage = async () => {
    if (imageUrl?.length && imageUrl?.length > 0) {
      for (let i = 0; i < imageUrl.length; i++) {
        const formData = new FormData();
        formData.append("propertyId", dataDefault.id);
        formData.append("image", imageUrl[i].originFileObj);
        await apiUploadImageProperty(formData);
      }
      toast.success("Thêm thành công");
      getImage(dataDefault.id);
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "image_url",
      key: "image_url",
      render: (data: any) => {
        return (
          <img className="w-[150px] h-[100px] object-cover" src={data} alt="" />
        );
      },
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "is_main",
      key: "is_main",
      render: (data: boolean, record: any) => {
        return (
          <Switch
            checked={data}
            onChange={(value) => handleUpdateMainImage(value, record)}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => {
        return (
          <div className="flex items-center space-x-4 text-sm">
            <button
              className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
              aria-label="Edit"
              onClick={() => handleDeleteImage(record.id)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="mt-2">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(updateSubmit)}
          className="form-primary add-property-form bg-white text-sm lg:text-base"
        >
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
            {dataDefault.property_type_id?.direction && (
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
            {dataDefault.property_type_id?.balonDirection && (
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
            {dataDefault.property_type_id?.isFurniture && (
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
            {dataDefault.property_type_id?.Legal && (
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
            {dataDefault.property_type_id?.Road && (
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
            {dataDefault.property_type_id?.Land_status && (
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
                  { label: "Đất có cấy ăn trái", value: "Đất có cấy ăn trái" },
                  {
                    label: "Đất có cây công nghiệp",
                    value: "Đất có cây công nghiệp",
                  },
                  { label: "Đất trông hoa", value: "Đất trông hoa" },
                ]}
              />
            )}
            {dataDefault.property_type_id?.Deposit_amount && (
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
            {dataDefault.property_type_id?.bedroom && (
              <FormInput
                form={form}
                name={"bedroom"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Số phòng ngủ"}
                type="number"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
            )}
            {dataDefault.property_type_id?.bathroom && (
              <FormInput
                form={form}
                name={"bathroom"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Số phòng tắm"}
                type="number"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
            )}
            {dataDefault.property_type_id?.floor && (
              <FormInput
                form={form}
                name={"floor"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Số tầng"}
                type="number"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
            )}
            {dataDefault.property_type_id?.ResidentialArea && (
              <FormInput
                form={form}
                name={"ResidentialArea"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Diện tích đất thổ cư"}
                type="number"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
            )}
            {dataDefault.property_type_id?.Horizontal && (
              <FormInput
                form={form}
                name={"Horizontal"}
                ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                label={"Chiều ngang"}
                type="number"
                ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
              />
            )}
            {dataDefault.property_type_id?.Length && (
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
          </div>

          <div>
            <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
              <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
              <button
                type="submit"
                className="relative z-1 px-30px lg:px-10 py-3 md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
              >
                Submit Property
              </button>
            </h5>
          </div>
        </form>
      </FormProvider>
      <div className="mt-5">
        <h1 className="font-bold mb-5">Quản lý ảnh:</h1>
        <div>
          <div className="w-full">
            <label
              htmlFor="image"
              className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
            >
              Thêm ảnh:
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
          <Button
            onClick={addImage}
            variant={"button1"}
            className="bg-red-500 my-3"
          >
            Thêm ảnh
          </Button>
        </div>
        <Table
          rowKey="id"
          dataSource={ImageProperty}
          columns={columns}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UpdatePost;
