import {
  apiaddPost,
  apideleteProperty,
  apigetPropertyUser,
  apiupdateStatusExpired,
} from "@/apis/property";
import { FormInput } from "@/components/forms";
import FormSelectAntd from "@/components/forms/FormSelectAntd";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useAppStore from "@/zustand/useAppStore";
import useMeStore from "@/zustand/useMeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Space,
  Table,
  Tag,
  Input,
  Select,
  Modal,
  Row,
  Col,
  Checkbox,
  Steps,
  Empty,
  Popconfirm,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import UpdatePost from "./UpdatePost";

interface PackagetypeInterface {
  id: string;
  name: string;
  price?: string;
  priority_level: number;
  isShowDecription: boolean;
  isShowDetails: boolean;
  isShowContactInfo: boolean;
  isShowOwnerName: boolean;
}
const formSchema = () =>
  z.object({
    package_type: z.string().min(1, { message: "trường này là bắt buộc." }),
    displayDays: z.string().min(1, { message: "trường này là bắt buộc." }),
  });
const ManagePost = () => {
  const [loading, setLoading] = useState(true);
  const [PropertyUser, setPropertyUser] = useState([]);
  const { provinces, getPackageTypes, PackageType } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idProperty, setidProperty] = useState("");
  const [PackageTypeInfor, setPackageTypeInfor] =
    useState<PackagetypeInterface>();
  const { me, getMe } = useMeStore();
  const [query, setquery] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    provinceId: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    packageTypeId: "",
  });
  const form = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      package_type: "",
      displayDays: "0",
    },
  });
  const selectedPackageType = form.watch("package_type");
  const getPropertys = async (queryValue?: any) => {
    const query = `page=${queryValue?.current || ""}&search=${
      queryValue?.search || ""
    }&provinceId=${queryValue?.provinceId || ""}&minPrice=${
      queryValue?.minPrice || ""
    }&maxPrice=${queryValue?.maxPrice || ""}&packageTypeId=${
      queryValue?.packageTypeId || ""
    }`;
    setLoading(true);
    try {
      const response = await apigetPropertyUser(query);
      if (response.data.success) {
        setPropertyUser(response.data.data);
        setquery((prev) => ({
          ...prev,
          current: response.data.currentPage,
          total: response.data.total,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const PackageTypeForm = PackageType.find(
      (item) => item.id === selectedPackageType
    );
    setPackageTypeInfor(PackageTypeForm);
  }, [selectedPackageType]);
  useEffect(() => {
    getPackageTypes();
  }, []);
  useEffect(() => {
    getPropertys(query);
  }, [
    query.current,
    query.maxPrice,
    query.minPrice,
    query.packageTypeId,
    query.pageSize,
    query.provinceId,
    query.search,
  ]);
  const handleSearch = (dataSearch: string) => {
    setquery((prev) => ({
      ...prev,
      search: dataSearch,
    }));
  };
  const handleProvinceChange = (dataProvince: string) => {
    setquery((prev) => ({
      ...prev,
      provinceId: dataProvince,
    }));
  };
  const handlePackageChange = (dataPackage: string) => {
    setquery((prev) => ({
      ...prev,
      packageTypeId: dataPackage,
    }));
  };
  const handleDelete = async (data: any) => {
    console.log(data);
    const response = await apideleteProperty(data.id);
    if (response.data.affected > 0) {
      getPropertys();
      toast.success("Xóa thành công");
    } else {
      toast.success("Có lổi xảy ra");
    }
  };
  const handlePost = async (data: any) => {
    data.totalCost =
      Number(PackageTypeInfor?.price) * Number(form.watch("displayDays"));
    const response = await apiaddPost(idProperty, data);
    if (response.data.success) {
      getPropertys(query);
      getMe();
    }
    toast.success(response.data.msg);
    form.setValue("displayDays", "");
    form.setValue("package_type", "");
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => index + 1, // Sử dụng `index + 1` để đánh số thứ tự
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: (a: any, b: any) => a.title.localeCompare(b.title),
      return: (data: any) => <p className="line-clamp-1">{data}</p>,
    },
    {
      title: "Ảnh",
      dataIndex: "mainImage",
      key: "mainImage",
      render: (data: any) => {
        let urlImage = data[0].image_url;
        let cap = data[0].caption;
        const results = data.filter((item: any) => item.is_main === true);
        if (results.length > 0) {
          urlImage = results[0].image_url;
          cap = results[0].caption;
        }
        return (
          <img className="w-30 h-20 object-cover" src={urlImage} alt={cap} />
        );
      },
    },
    {
      title: "Loại tin",
      dataIndex: "listingType",
      key: "listingType",
      render: (data: any, record: any) => {
        return <p>{record.property_type_id.listingType}</p>;
      },
    },
    {
      title: "Gói tin",
      dataIndex: "package_type",
      key: "package_type",
      render: (data: any) => data?.name,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (data: any) => {
        let color;
        if (data === "pending") {
          color = "blue";
        }
        if (data === "approved") {
          color = "geekblue";
        }
        if (data === "rejected") {
          color = "red";
        }
        return (
          <Tag className="p-2 font-medium" color={color}>
            {data.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Thời gian còn lại",
      key: "remainingTime",
      render: (text: any, record: any) => {
        if (record.status !== "approved" && record.status !== "expired") {
          return <span className="text-gray-500">Không hoạt động</span>;
        }

        const now = new Date();
        const endDate = new Date(record.end_date);

        if (endDate <= now) {
          // if (record.status === "approved") {
          //   updateStatusExpired(record.id);
          // }
          return <span className="text-red-500">Hết hạn</span>;
        }

        return (
          <Countdown
            date={endDate}
            renderer={({ days, hours, minutes, seconds }) => (
              <span>
                {days} ngày {hours}:{minutes}:{seconds}
              </span>
            )}
          />
        );
      },
    },
    {
      title: "Ngày kết thúc",
      key: "end_date",
      render: (data: any) => {
        if (data.end_date !== null) {
          return moment(data.end_date).format("DD/MM/YYYY HH:mm");
        } else {
          return;
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => {
        return (
          <div className="flex items-center space-x-4 text-sm justify-end">
            {record.status !== "pending" && record.status !== "approved" && (
              <button
                className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                aria-label="Delete"
                onClick={() => {
                  setIsModalOpen(true);
                  setidProperty(record.id);
                }}
              >
                <i className="fa-solid fa-check fa-2x"></i>
              </button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600  rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                  aria-label="Edit"
                  onClick={() => console.log(record)}
                  disabled={record.status === "approved" ? true : false}
                >
                  <i className="fa-solid fa-pen-to-square fa-lg"></i>
                </button>
              </SheetTrigger>
              <SheetContent className="!max-w-[1000px] overflow-scroll">
                <SheetHeader>
                  <SheetTitle>Chỉnh sửa tin đăng</SheetTitle>
                </SheetHeader>
                <UpdatePost dataDefault={record} handleGetData={getPropertys} />
              </SheetContent>
            </Sheet>
            <button
              className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
              aria-label="Delete"
              onClick={() => handleDelete(record)}
              disabled={record.status === "approved" ? true : false}
            >
              <i className="fa-solid fa-trash fa-lg"></i>
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="transition-all duration-300 ">
      {me && me.status === "open" ? (
        <>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <Select
                className="w-[200px]"
                placeholder={"Tỉnh/Thành phố"}
                onChange={(value) => handleProvinceChange(value)}
              >
                <Select.Option key={"all"} value={""}>
                  Tất cả
                </Select.Option>
                {provinces.map((items, index) => (
                  <Select.Option key={index} value={items.id}>
                    {items.name}
                  </Select.Option>
                ))}
              </Select>
              <Select
                className="w-[200px]"
                placeholder={"Gói tin"}
                onChange={(value) => handlePackageChange(value)}
              >
                <Select.Option key={"all"} value={""}>
                  Tất cả
                </Select.Option>
                {PackageType.map((items, index) => (
                  <Select.Option key={index} value={items.id}>
                    {items.name}
                  </Select.Option>
                ))}
              </Select>
              <Input.Search
                placeholder="input search text"
                onSearch={(value) => handleSearch(value)}
                style={{ width: 200 }}
              />
            </Space>
            <Table
              rowKey="id"
              dataSource={PropertyUser}
              columns={columns}
              pagination={{
                current: query.current,
                pageSize: query.pageSize,
                total: query.total,
                onChange: (page) => {
                  setquery((prev) => ({ ...prev, current: page }));
                },
              }}
              loading={loading}
            />
          </Space>
          <Modal
            title="Chọn gói tin đăng"
            mask={false}
            style={{
              top: 100,
            }}
            width={800}
            open={isModalOpen}
            onCancel={() => {
              form.setValue("displayDays", "");
              form.setValue("package_type", "");
              setIsModalOpen(false);
            }}
            onClose={() => {
              form.setValue("displayDays", "");
              form.setValue("package_type", "");
              setIsModalOpen(false);
            }}
            footer={null}
          >
            <div className="flex my-5">
              <div className="basis-1/2">
                <Label>Đặc điểm gói tin:</Label>
                <Row gutter={[16, 20]}>
                  <Col span={12}>
                    <Checkbox checked={PackageTypeInfor?.isShowDecription}>
                      Hiện mô tả tin đăng
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox checked={PackageTypeInfor?.isShowDetails}>
                      Hiện đặc điểm
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox checked={PackageTypeInfor?.isShowOwnerName}>
                      Hiện tên chủ sở hửu
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox checked={PackageTypeInfor?.isShowContactInfo}>
                      Hiện thông tin liên hệ
                    </Checkbox>
                  </Col>
                </Row>
              </div>
              <div className="basis-1/2">
                <Label>Cấp độ ưu tiên hiển thị:</Label>
                <Steps
                  direction="vertical"
                  current={Number(PackageTypeInfor?.priority_level)}
                  items={[
                    {
                      title: "Thường",
                      description: "Nhỏ nhất",
                    },
                    {
                      title: "Vip",
                      description: "Trung bình",
                    },
                    {
                      title: "Super Vip",
                      description: "Lớn",
                    },
                  ]}
                />
              </div>
            </div>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handlePost)}>
                <div className="grid grid-cols-2 gap-30px mb-35px">
                  <div className="col-span-1">
                    <FormSelectAntd
                      form={form}
                      Placeholder="gói tin"
                      name="package_type"
                      ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                      label={"Gói tin:"}
                      classSelect="text-paragraph-color  outline-none h-[40px] block w-full placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                      options={PackageType.map((el) => ({
                        label: el.name,
                        value: el.id,
                      }))}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        form={form}
                        name={"displayDays"}
                        ClassNameLable="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px text-[60px] "
                        label={"Số ngày đăng"}
                        type="number"
                        ClassNameInput="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 hover:border-blue-300 focus:border-blue-300 h-65px block w-full rounded-md placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 bg-gray-200 flex items-center p-4 text-[15px]">
                    <menu>
                      <li className="my-2">
                        Số dư của bạn: {me?.balance || 0} VND
                      </li>
                      <li className="my-2">
                        Tên gói: {PackageTypeInfor?.name}
                      </li>
                      <li className="my-2">
                        Giá: {PackageTypeInfor?.price || 0} VND 1 ngày
                      </li>
                      <li className="my-2">
                        Tổng giá:{" "}
                        {Number(PackageTypeInfor?.price) *
                          Number(form.watch("displayDays")) || 0}{" "}
                        VND
                      </li>
                    </menu>
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <Button
                    variant={"button1"}
                    type="submit"
                    className={"bg-red-500"}
                  >
                    Đăng tin
                  </Button>
                </div>
              </form>
            </FormProvider>
          </Modal>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Tài khoản của bạn đã bị khóa"
        />
      )}
    </div>
  );
};

export default ManagePost;
