import {
  apiBrowsePost,
  apideleteProperty,
  apigetPropertyAdmin,
  apiUnPost,
} from "@/apis/property";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useAppStore from "@/zustand/useAppStore";
import { Input, Modal, Popconfirm, Select, Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdatePost from "./property/UpdatePost";
import Countdown from "react-countdown";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TextArea from "antd/es/input/TextArea";
import { Button } from "@/components/ui/button";
import moment from "moment";

const formSchema = () =>
  z.object({
    reasonUnpost: z.string().min(1, { message: "trường này là bắt buộc." }),
  });

const Property = () => {
  const [loading, setLoading] = useState(true);
  const [PropertyAdmin, setPropertyAdmin] = useState([]);
  const { provinces, getPackageTypes, PackageType } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idPost, setidPost] = useState("");
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
      reasonUnpost: "",
    },
  });
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
    const response = await apideleteProperty(data.id);
    if (response.data.affected > 0) {
      getPropertys();
      toast.success("Xóa thành công");
    } else {
      toast.success("Có lổi xảy ra");
    }
  };

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
      const response = await apigetPropertyAdmin(query);
      if (response.data.success) {
        setPropertyAdmin(response.data.data);
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
  const handleBrowse = async (data: any) => {
    const response = await apiBrowsePost(data.id);
    if (response.data.success) {
      getPropertys(query);
      toast.success(response.data.msg);
    } else {
      toast.error(response.data.msg);
    }
  };
  const handleUnPost = async (data: any) => {
    const response = await apiUnPost(idPost, data);
    if (response.data.success) {
      getPropertys();
      toast.success(response.data.msg);
      setIsModalOpen(false);
    } else {
      toast.error(response.data.msg);
    }
  };
  const handleCopyid = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      toast.success("Sao chép thành công");
    });
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => index + 1, // Sử dụng `index + 1` để đánh số thứ tự
    },
    {
      title: "Mã tin đăng",
      dataIndex: "id",
      key: "id",
      render: (data: any, record: any) => {
        return (
          <div className="flex items-center gap-2">
            <p className={"font-bold "}>{record.id}</p>
            <i
              onClick={() => handleCopyid(record.id)}
              className="fa-regular fa-copy cursor-pointer hover:text-red-500"
            ></i>
          </div>
        );
      },
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
      title: "Loại tin đăng",
      dataIndex: "property_type_id",
      key: "property_type_id",
      render: (data: any, record: any) => {
        return <p>{record.property_type_id.name}</p>;
      },
    },
    {
      title: "Gói tin",
      dataIndex: "package_type",
      key: "package_type",
      render: (data: any) => data.name,
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
        if (record.status !== "approved") {
          return <span className="text-gray-500">Không hoạt động</span>;
        }

        const now = new Date();
        const endDate = new Date(record.end_date);

        if (endDate <= now) {
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
            {record.status === "pending" && (
              <Popconfirm
                title="Bạn có muốn duyệt tin đăng này không ?"
                onConfirm={() => handleBrowse(record)}
              >
                <button
                  className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                  aria-label="Delete"
                >
                  <i className="fa-solid fa-check fa-2x"></i>
                </button>
              </Popconfirm>
            )}
            {(record.status === "approved" || record.status === "pending") && (
              <button
                className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                aria-label="Delete"
                onClick={() => {
                  setidPost(record.id);
                  form.setValue("reasonUnpost", "");
                  setIsModalOpen(true);
                }}
              >
                <i className="fa-solid fa-xmark fa-2x"></i>
              </button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600  rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                  aria-label="Edit"
                >
                  <i className="fa-solid fa-pen-to-square fa-lg"></i>
                </button>
              </SheetTrigger>
              <SheetContent className="!max-w-[1000px] overflow-scroll">
                <SheetHeader>
                  <SheetTitle>Chỉ tiết tin đăng</SheetTitle>
                </SheetHeader>
                <UpdatePost dataDefault={record} handleGetData={getPropertys} />
              </SheetContent>
            </Sheet>
          </div>
        );
      },
    },
  ];
  return (
    <main className="h-full pb-16 overflow-y-auto">
      <div className="container grid px-6 mx-auto">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Quản lí tin đăng
        </h2>
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
            dataSource={PropertyAdmin}
            columns={columns}
            pagination={{
              current: query.current,
              pageSize: query.pageSize,
              total: query.total,
              onChange: (page) => {
                setquery({ ...query, current: page });
              },
            }}
            loading={loading}
          />
        </Space>
      </div>
      <Modal
        title="Bạn muốn hủy đăng tin?"
        mask={false}
        style={{
          top: 250,
        }}
        open={isModalOpen}
        onCancel={() => {
          form.setValue("reasonUnpost", "");
          setIsModalOpen(false);
        }}
        onClose={() => {
          form.setValue("reasonUnpost", "");
          setIsModalOpen(false);
        }}
        footer={null}
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleUnPost)}>
            <FormField
              name={"reasonUnpost"}
              control={form.control}
              render={({ field }: { field: any }) => {
                return (
                  <FormItem>
                    <FormLabel>Lý do hủy:</FormLabel>
                    <FormControl>
                      <TextArea
                        {...field}
                        showCount
                        maxLength={100}
                        placeholder="disable resize"
                        style={{ height: 120, resize: "none" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end mt-5">
              <Button
                variant={"button1"}
                type="submit"
                className={"bg-red-500"}
              >
                Xạc nhận hủy
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </main>
  );
};

export default Property;
