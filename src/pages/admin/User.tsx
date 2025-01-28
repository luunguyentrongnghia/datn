import { apigetUsers, apiUpdateStatusUserAdmin } from "@/apis/user";
import { FormInput } from "@/components/forms";
import Image from "@/components/layous/Image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { generateDefaultAvatar } from "@/lib/utils";
import { Input, Modal, Select, Space, Switch, Table, Tag } from "antd";
import { formatNumber } from "humanize-plus";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const User = () => {
  const [UserData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const getUsers = async (queryValue?: any) => {
    try {
      let queryData = `page=${queryValue?.current}`;
      if (query.search !== "") {
        queryData = queryData + `&search=${queryValue.search}`;
      }
      if (queryValue.DaysAgo !== "") {
        queryData = queryData + `&DaysAgo=${queryValue.DaysAgo}`;
      } else if (queryValue.startDate !== "" && queryValue.endDate !== "") {
        queryData =
          queryData +
          `&startDate=${queryValue.startDate}` +
          `&endDate=${queryValue.endDate}`;
      }
      const response = await apigetUsers(queryData);
      if (response.data.success) {
        setUserData(response.data.data);
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
    getUsers(query);
  }, [
    query.current,
    query.pageSize,
    query.search,
    query.DaysAgo,
    query.endDate,
    query.startDate,
  ]);
  const handleUpdateStatus = async (record: any) => {
    let statusUser = record.status === "open" ? "lock" : "open";
    const UpdateStatus = await apiUpdateStatusUserAdmin(record.id, {
      status: statusUser,
    });
    console.log(UpdateStatus);
    if (UpdateStatus && UpdateStatus.data.success) {
      getUsers();
    }
  };
  const handleSearchDate = (data: any) => {
    setquery((prev) => ({
      ...prev,
      DaysAgo: "",
      endDate: data.endDate,
      startDate: data.startDate,
    }));
    setIsModalOpen(false);
  };
  const handleSearch = (dataSearch: string) => {
    setquery((prev) => ({
      ...prev,
      search: dataSearch,
    }));
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (data: any, record: any) => {
        return (
          <Image
            fallbackSrc={generateDefaultAvatar(record.fullname)}
            src={record.avatar}
            className="rounded-full h-50px w-50px"
          />
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (data: any) => {
        let color;
        if (data === "open") {
          color = "geekblue";
        }
        if (data === "lock") {
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
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Ngày tạo tài khoản",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data: any) => {
        return <p>{moment(data).format("DD/MM/YYYY")}</p>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => {
        return (
          <div className="flex gap-3">
            <Switch
              defaultChecked={record.status === "open"}
              onChange={() => handleUpdateStatus(record)}
            />
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
                  <SheetTitle>Thông tin user</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <div className="flex gap-3">
                    <Image
                      fallbackSrc={generateDefaultAvatar(record.fullname)}
                      src={record.avatar}
                      className="rounded-full h-100px w-100px"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-[30px]">{record.fullname}</p>
                      <p>{record.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mt-5">
                    <p className="font-bold text-[20px]">Ngày tạo tài khoản:</p>
                    <p id="address">
                      {moment(record.createdAt).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center mt-5">
                    <p className="font-bold text-[20px]">Số dư:</p>
                    <p id="address">
                      {formatNumber(Number(record.balance))} VNĐ
                    </p>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-5 bg-gray-200 p-2">
                    <div className="flex gap-2 items-center">
                      <p className="font-bold text-[18px]">Vai trò:</p>
                      <p id="address">{record.role}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="font-bold text-[18px]">Trạng thái:</p>
                      <p id="address">{record.status}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="font-bold text-[18px]">Địa chỉ:</p>
                      <p id="address">{record.address}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="font-bold text-[18px]">Tỉnh/Thành:</p>
                      <p id="address">{record?.province?.name}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="font-bold text-[18px]">Quận/Huyện:</p>
                      <p id="address">{record.district?.name}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="font-bold text-[18px]">Phường/Xã:</p>
                      <p id="address">{record.ward?.name}</p>
                    </div>
                  </div>
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
            className="w-[200px]"
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
          <Input.Search
            placeholder="input search text"
            onSearch={(value) => handleSearch(value)}
            style={{ width: 200 }}
          />
        </Space>
        <Table
          rowKey="id"
          dataSource={UserData}
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
              <Button
                variant={"button1"}
                type="submit"
                className={"bg-red-500"}
              >
                Áp dụng
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
};

export default User;
