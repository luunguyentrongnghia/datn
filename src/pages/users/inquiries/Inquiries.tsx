import { apigetInquiries, apiupdateStatusInquiries } from "@/apis/Inquiries";
import { FormInput } from "@/components/forms";
import Image from "@/components/layous/Image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { generateDefaultAvatar } from "@/lib/utils";
import { Button, Checkbox, Modal, Select, Space, Table, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button as ButtonShacui } from "@/components/ui/button";
const Inquiries = () => {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setquery] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    search: "",
    DaysAgo: "",
    startDate: "",
    endDate: "",
  });
  const form = useForm({
    defaultValues: {
      endDate: new Date().toISOString().split("T")[0],
      startDate: (() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 6);
        return date.toISOString().split("T")[0];
      })(),
    },
  });
  const getInquiries = async (queryValue?: any) => {
    try {
      let queryData = `page=${queryValue?.current}`;
      if (queryValue.DaysAgo !== "") {
        queryData = queryData + `&DaysAgo=${queryValue.DaysAgo}`;
      } else if (queryValue.startDate !== "" && queryValue.endDate !== "") {
        queryData =
          queryData +
          `&startDate=${queryValue.startDate}` +
          `&endDate=${queryValue.endDate}`;
      }
      const response = await apigetInquiries(queryValue);
      console.log(response);
      if (response.data.success) {
        setInquiries(response.data.data);
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
    getInquiries(query);
  }, [
    query.current,
    query.pageSize,
    query.search,
    query.DaysAgo,
    query.endDate,
    query.startDate,
  ]);
  const handleSearchDate = (data: any) => {
    setquery((prev) => ({
      ...prev,
      DaysAgo: "",
      endDate: data.endDate,
      startDate: data.startDate,
    }));
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Người liên hệ",
      dataIndex: "fullname",
      key: "fullname",
      render: (data: any, record: any) => {
        return (
          <div className="flex items-center gap-2">
            <Image
              fallbackSrc={generateDefaultAvatar(record.contactUser.fullname)}
              src={record.contactUser.avatar}
              className="rounded-full h-50px w-50px"
            />
            <p className={"font-bold "}>{record.contactUser.fullname}</p>
          </div>
        );
      },
    },
    {
      title: "Thông tin liên hệ",
      dataIndex: "infor",
      key: "infor",
      render: (data: any, record: any) => {
        return <p className={"font-bold "}>{record.infor}</p>;
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (data: any) => {
        let color;
        if (data === "approved") {
          color = "geekblue";
        }
        if (data === "pending") {
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
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data: any, record: any) => {
        return (
          <p className={"font-bold "}>
            {moment(record.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => {
        const handleUpdateStatus = async (data: any) => {
          let status;
          if (data === true) {
            status = "approved";
          } else {
            status = "pending";
          }
          const updateStatus = await apiupdateStatusInquiries(record.id, {
            status,
          });
          if (updateStatus.data.success) {
            getInquiries();
            toast.success(updateStatus.data.msg);
          } else {
            toast.error(updateStatus.data.msg);
          }
        };
        return (
          <div className="flex gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600  rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                  aria-label="Edit"
                >
                  <i className="fa-solid fa-pen-to-square fa-lg"></i>
                </button>
              </SheetTrigger>
              <SheetContent className="!max-w-[600px]">
                <SheetHeader>
                  <SheetTitle>Chi tiết liên hệ</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <div className="flex gap-3">
                    <Image
                      fallbackSrc={generateDefaultAvatar(
                        record.contactUser.fullname
                      )}
                      src={record.contactUser.avatar}
                      className="rounded-full h-100px w-100px"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-[30px]">
                        {record.contactUser.fullname}
                      </p>
                      <p>{record.contactUser.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mt-5">
                    <p className="font-bold text-[20px]">sản phẩm:</p>
                    <a href={record.url}>
                      <Button>Chuyển đến sản phẩm</Button>
                    </a>
                  </div>
                  <div className="flex gap-2 items-center mt-5">
                    <p className="font-bold text-[20px]">Ngày tạo tài khoản:</p>
                    <p id="address">
                      {moment(record.createdAt).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="mt-5 bg-gray-200 p-2">{record.message}</div>
                  <Checkbox
                    onChange={handleUpdateStatus}
                    defaultChecked={record.status == "approved"}
                    className="mt-3"
                  >
                    Cập nhật trạng thái
                  </Checkbox>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Select
            className="w-[200px] mt-6"
            placeholder={"Thời gian"}
            defaultValue={query.DaysAgo.toString()}
            onChange={(value) => {
              if (value === "tuychon") {
                setIsModalOpen(true);
                form.reset();
              } else {
                setquery((prev) => ({
                  ...prev,
                  DaysAgo: value,
                  endDate: "",
                  startDate: "",
                }));
              }
            }}
          >
            <Select.Option key={"all"} value={""}>
              Mặc định
            </Select.Option>
            <Select.Option key={"1tuan"} value={"1"}>
              1 tuần
            </Select.Option>
            <Select.Option key={"30ngay"} value={"30"}>
              30 Ngày
            </Select.Option>
            <Select.Option key={"tuychon"} value={"tuychon"}>
              Tùy chọn ngày
            </Select.Option>
          </Select>
        </Space>
        <Table
          rowKey="id"
          dataSource={inquiries}
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
        title="Tùy chọn ngày"
        mask={false}
        style={{
          top: 200,
        }}
        width={500}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        onClose={() => {
          setIsModalOpen(false);
        }}
        footer={null}
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSearchDate)}>
            <FormInput
              type="date"
              form={form}
              name="startDate"
              label="Ngày bất đầu"
            />
            <FormInput
              type="date"
              form={form}
              name="endDate"
              label="Ngày kết thúc"
            />
            <div className="flex justify-end mt-5">
              <ButtonShacui
                variant={"button1"}
                type="submit"
                className={"bg-red-500"}
              >
                Áp dụng
              </ButtonShacui>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
};

export default Inquiries;
