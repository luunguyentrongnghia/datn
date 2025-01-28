import {
  apideletetReportProperty,
  apigetReportProperty,
  apiupdateStatusReportProperty,
} from "@/apis/ReportProperty";
import FormSelectAntd from "@/components/forms/FormSelectAntd";
import Image from "@/components/layous/Image";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { generateDefaultAvatar } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Table, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button as ButtonShacui } from "@/components/ui/button";
import { toast } from "sonner";
const formSchema = () =>
  z.object({
    assess: z.string().min(1, { message: "trường này là bắt buộc." }),
  });
const ReportProperty = () => {
  const [loading, setLoading] = useState(true);
  const [reportProperty, setReportProperty] = useState([]);
  const [idUpdateReport, setIdUpdateReport] = useState();
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
    resolver: zodResolver(formSchema()),
    defaultValues: {
      id: "",
      assess: "",
      adminNote: "",
    },
  });
  const getReport = async (queryValue?: any) => {
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
      const response = await apigetReportProperty(queryData);
      console.log(response);
      if (response.data.success) {
        setReportProperty(response.data.data);
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
    getReport(query);
  }, [
    query.current,
    query.pageSize,
    query.search,
    query.DaysAgo,
    query.endDate,
    query.startDate,
  ]);
  const handleFeedback = async (data: any) => {
    data.status = "approved";
    if (idUpdateReport) {
      const res = await apiupdateStatusReportProperty(idUpdateReport, data);
      if (res.data.success) {
        toast.success(res.data.msg);
        getReport(query);
      } else {
        toast.error(res.data.msg);
      }
    }
  };
  const handleDelete = async (id: string) => {
    const res = await apideletetReportProperty(id);
    if (res.data.success) {
      toast.success(res.data.msg);
      getReport(query);
    } else {
      toast.error(res.data.msg);
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
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Người liên hệ",
      dataIndex: "user",
      key: "user",
      render: (data: any, record: any) => {
        return (
          <div className="flex items-center gap-2">
            <Image
              fallbackSrc={generateDefaultAvatar(record.user.fullname)}
              src={record.user.avatar}
              className="rounded-full h-50px w-50px"
            />
            <p className={"font-bold "}>{record.user.fullname}</p>
          </div>
        );
      },
    },
    {
      title: "Mã tin đăng",
      dataIndex: "post",
      key: "post",
      render: (data: any, record: any) => {
        return (
          <div className="flex items-center gap-2">
            <p className={"font-bold "}>{record.id}</p>
            <i
              onClick={() => handleCopyid(record.post.id)}
              className="fa-regular fa-copy cursor-pointer hover:text-red-500"
            ></i>
          </div>
        );
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
                      fallbackSrc={generateDefaultAvatar(record.user.fullname)}
                      src={record.user.avatar}
                      className="rounded-full h-100px w-100px"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-[30px]">
                        {record.user.fullname}
                      </p>
                      <p>{record.user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mt-5">
                    <p className="font-bold text-[20px]">Tin đăng:</p>
                    <a href={record.url}>
                      <Button>Chuyển đến tin đăng</Button>
                    </a>
                  </div>
                  <div className="flex gap-2 items-center mt-5">
                    <p className="font-bold text-[20px]">Mã tin đăng:</p>
                    <p id="address">{record.post.id}</p>
                    <i
                      onClick={() => handleCopyid(record.post.id)}
                      className="fa-regular fa-copy cursor-pointer hover:text-red-500"
                    ></i>
                  </div>
                  {record.access && (
                    <div className="flex gap-2 items-center mt-5">
                      <p className="font-bold text-[20px]">Đánh giá:</p>
                      <p id="address">{record.access}</p>
                    </div>
                  )}

                  <div className="mt-5 bg-gray-200 p-2">{record.reason}</div>
                  {record.status === "pending" && (
                    <div className="mt-5">
                      <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(handleFeedback)}>
                          <FormSelectAntd
                            form={form}
                            label={"Đánh giá"}
                            classSelect="block w-[50%]"
                            name="assess"
                            options={[
                              { label: "vi phạm", value: "vi phạm" },
                              {
                                label: "không vi phạm",
                                value: "không vi phạm",
                              },
                            ]}
                          />
                          <FormField
                            name={"adminNote"}
                            control={form.control}
                            render={({ field }: { field: any }) => {
                              return (
                                <FormItem className="mb-4">
                                  <FormLabel>Phản hồi:</FormLabel>
                                  <FormControl>
                                    <TextArea rows={4} {...field} />
                                  </FormControl>
                                </FormItem>
                              );
                            }}
                          />
                          <div className="flex justify-end mt-5">
                            <ButtonShacui
                              variant={"button1"}
                              type="submit"
                              className={"bg-red-500"}
                              onClick={() => setIdUpdateReport(record.id)}
                            >
                              Phản hồi
                            </ButtonShacui>
                          </div>
                        </form>
                      </FormProvider>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <button
              className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
              aria-label="Delete"
              onClick={() => handleDelete(record.id)}
            >
              <i className="fa-solid fa-xmark fa-2x"></i>
            </button>
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
        <Table
          rowKey="id"
          dataSource={reportProperty}
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
      </div>
    </main>
  );
};

export default ReportProperty;
