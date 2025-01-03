import { AccordionCustom } from "@/components/admin/accordion";
import { FormInput } from "@/components/forms";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { ColorPicker, Space, Switch, Table } from "antd";
import { Button } from "@/components/ui/button";
import {
  apicreatePackageType,
  apideletetPackageType,
  apigetPackageTypeAdmin,
  apiupdatePackageType,
} from "@/apis/property";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import moment from "moment";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { SheetCustom } from "@/components/admin/sheet";
import FormSelectAntd from "@/components/forms/FormSelectAntd";
const formSchema = () =>
  z.object({
    name: z.string().min(1, { message: "trường này là bắt buộc." }),
    price: z.number().min(1, { message: "trường này là bắt buộc." }),
    priority_level: z.number().min(1, { message: "trường này là bắt buộc." }),
    isShowDecription: z.boolean(),
    isShowDetails: z.boolean(),
    isShowContactInfo: z.boolean(),
    isShowOwnerName: z.boolean(),
    color: z.string().min(1, { message: "trường này là bắt buộc." }),
  });
const PackageType = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [PackageTypeData, setPackageTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    getPackageTypes(pagination.current);
  }, [pagination.current, pagination.pageSize]);
  const form = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      name: "",
      price: 0,
      priority_level: null,
      isShowDecription: false,
      isShowDetails: false,
      isShowContactInfo: false,
      isShowOwnerName: false,
      color: "",
    },
  });
  const form2 = useForm({
    defaultValues: {
      name: "",
      price: 0,
      priority_level: null,
      isShowDecription: false,
      isShowDetails: false,
      isShowContactInfo: false,
      isShowOwnerName: false,
      color: "",
    },
  });
  const getPackageTypes = async (pageNumber?: number) => {
    const query = `page=${pageNumber}`;
    setLoading(true);
    try {
      const response = await apigetPackageTypeAdmin(query);
      if (response.data.success) {
        setPackageTypeData(response.data.data);
        setPagination((prev) => ({
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
  const addPackage = async (data: any) => {
    console.log(data);
    const response = await apicreatePackageType(data);
    if (response.data.success) {
      toast.success(response.data.msg);
      form.reset();
      getPackageTypes();
    } else {
      toast.error(response.data.msg);
    }
  };
  const handleDelete = async () => {
    if (selectedRowKeys.length > 0) {
      const response = await apideletetPackageType({ ids: selectedRowKeys });
      if (response.data.affected > 0) {
        getPackageTypes();
        toast.success("Xóa thành công");
      } else {
        toast.success("Có lổi xảy ra");
      }
    }
  };
  const handleUpdatePackageType = async (data: any, record: any) => {
    data.price = Number(data.price);
    const response = await apiupdatePackageType(data, record.id);
    if (response.data.affected > 0) {
      toast.success("Cập nhật thành công");
      getPackageTypes();
    } else {
      toast.error("Lổi không thể cập nhật");
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (data: any) => setSelectedRowKeys(data),
    selections: [
      {
        key: "delete",
        text: (
          <div className=" px-2">
            <i className="fa-solid fa-trash mr-2"></i>
            Xóa
          </div>
        ),
        onSelect: () => handleDelete(),
      },
    ],
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => index + 1, // Sử dụng `index + 1` để đánh số thứ tự
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a: any, b: any) => a.price - b.price,
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Cấp độ",
      dataIndex: "priority_level",
      key: "priority_level",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) =>
        moment(createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: string) =>
        moment(updatedAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <div className="flex items-center space-x-4 text-sm">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                aria-label="Edit"
                onClick={() => {
                  form2.setValue("name", record.name);
                  form2.setValue("price", record.price);
                  form2.setValue("priority_level", record.priority_level);
                  form2.setValue("color", record.color);
                  form2.setValue("isShowContactInfo", record.isShowContactInfo);
                  form2.setValue("isShowOwnerName", record.isShowOwnerName);
                  form2.setValue("isShowDetails", record.isShowDetails);
                  form2.setValue("isShowDecription", record.isShowDecription);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </SheetTrigger>
            <SheetCustom
              form={form2}
              title="chỉnh sửa loại tin đăng"
              onSubmit={(data) => handleUpdatePackageType(data, record)}
              classNameSheet="!max-w-[1000px]"
            >
              <div className="grid grid-cols-5 gap-5">
                <div className="col-span-4">
                  <FormInput
                    form={form2}
                    type="text"
                    name="name"
                    Placeholder="Thường"
                    label="Tên gói tin"
                    ClassNameLable="text-gray-700 dark:text-gray-400"
                    ClassNameInput="text-black"
                  />
                  <FormInput
                    form={form2}
                    type="number"
                    name="price"
                    label="Giá gói tin (VND)"
                    Placeholder="0"
                    ClassNameLable="text-gray-700 dark:text-gray-400"
                    ClassNameInput="text-black w-[50%]"
                  />
                  <FormField
                    name="color"
                    control={form2.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Màu hiển thị:
                        </FormLabel>
                        <FormControl>
                          <Space direction="vertical" className="block">
                            <ColorPicker
                              defaultValue={field.value}
                              size="large"
                              showText
                              onChange={(color) =>
                                field.onChange(color.toHexString())
                              }
                            />
                          </Space>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormSelectAntd
                    form={form2}
                    name="priority_level"
                    label="Độ ưu tiên:"
                    ClassNameLable="text-gray-700 dark:text-gray-400"
                    classSelect="block w-[50%]"
                    options={[
                      { label: "1", value: 1 },
                      { label: "2", value: 2 },
                      { label: "3", value: 3 },
                    ]}
                  />
                </div>
                <div>
                  <FormField
                    name="isShowDecription"
                    control={form2.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Hiện mô tả:
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            className="block"
                            onChange={(checked) => field.onChange(checked)}
                            style={{
                              backgroundColor: field.value
                                ? "rgb(147 51 234 / var(--tw-bg-opacity))"
                                : "",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="isShowDetails"
                    control={form2.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Hiện thông số chi tiết:
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            className="block"
                            onChange={(checked) => field.onChange(checked)}
                            style={{
                              backgroundColor: field.value
                                ? "rgb(147 51 234 / var(--tw-bg-opacity))"
                                : "",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="isShowContactInfo"
                    control={form2.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Hiện thông tin liên hệ:
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            className="block"
                            onChange={(checked) => field.onChange(checked)}
                            style={{
                              backgroundColor: field.value
                                ? "rgb(147 51 234 / var(--tw-bg-opacity))"
                                : "",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="isShowOwnerName"
                    control={form2.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Hiện tên người đăng:
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            className="block"
                            style={{
                              backgroundColor: field.value
                                ? "rgb(147 51 234 / var(--tw-bg-opacity))"
                                : "",
                            }}
                            onChange={(checked) => field.onChange(checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </SheetCustom>
          </Sheet>
        </div>
      ),
    },
  ];
  return (
    <main className="h-full pb-16 overflow-y-auto">
      <div className="container grid px-6 mx-auto">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Gói tin đăng
        </h2>
        <AccordionCustom title="Thêm gói tin đăng">
          <FormProvider {...form}>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <form
                className="block mt-4 text-sm "
                onSubmit={form.handleSubmit(addPackage)}
              >
                <div className="grid grid-cols-5 gap-5">
                  <div className="col-span-4">
                    <FormInput
                      form={form}
                      type="text"
                      name="name"
                      Placeholder="Thường"
                      label="Tên gói tin"
                      ClassNameLable="text-gray-700 dark:text-gray-400"
                      ClassNameInput="text-black"
                    />
                    <FormInput
                      form={form}
                      formatNumber={true}
                      name="price"
                      label="Giá gói tin (VND)"
                      Placeholder="0"
                      ClassNameLable="text-gray-700 dark:text-gray-400"
                      ClassNameInput="text-black w-[50%]"
                    />
                    <FormSelectAntd
                      form={form}
                      name="priority_level"
                      label="Độ ưu tiên:"
                      ClassNameLable="text-gray-700 dark:text-gray-400"
                      classSelect="block w-[50%]"
                      options={[
                        { label: "1", value: 1 },
                        { label: "2", value: 2 },
                        { label: "3", value: 3 },
                      ]}
                    />
                    <FormField
                      name="color"
                      control={form.control}
                      render={({ field }: { field: any }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="text-gray-700 dark:text-gray-400">
                            Màu hiển thị:
                          </FormLabel>
                          <FormControl>
                            <Space direction="vertical" className="block">
                              <ColorPicker
                                size="large"
                                showText
                                onChange={(color) =>
                                  field.onChange(color.toHexString())
                                }
                              />
                            </Space>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      name="isShowDecription"
                      control={form.control}
                      render={({ field }: { field: any }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="text-gray-700 dark:text-gray-400">
                            Hiện mô tả:
                          </FormLabel>
                          <FormControl>
                            <Switch
                              defaultChecked={false}
                              className="block"
                              onChange={(checked) => field.onChange(checked)}
                              style={{
                                backgroundColor: field.value
                                  ? "rgb(147 51 234 / var(--tw-bg-opacity))"
                                  : "",
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="isShowDetails"
                      control={form.control}
                      render={({ field }: { field: any }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="text-gray-700 dark:text-gray-400">
                            Hiện thông số chi tiết:
                          </FormLabel>
                          <FormControl>
                            <Switch
                              defaultChecked={false}
                              className="block"
                              onChange={(checked) => field.onChange(checked)}
                              style={{
                                backgroundColor: field.value
                                  ? "rgb(147 51 234 / var(--tw-bg-opacity))"
                                  : "",
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="isShowContactInfo"
                      control={form.control}
                      render={({ field }: { field: any }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="text-gray-700 dark:text-gray-400">
                            Hiện thông tin liên hệ:
                          </FormLabel>
                          <FormControl>
                            <Switch
                              defaultChecked={false}
                              className="block"
                              onChange={(checked) => field.onChange(checked)}
                              style={{
                                backgroundColor: field.value
                                  ? "rgb(147 51 234 / var(--tw-bg-opacity))"
                                  : "",
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="isShowOwnerName"
                      control={form.control}
                      render={({ field }: { field: any }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="text-gray-700 dark:text-gray-400">
                            Hiện tên người đăng:
                          </FormLabel>
                          <FormControl>
                            <Switch
                              defaultChecked={false}
                              className="block"
                              style={{
                                backgroundColor: field.value
                                  ? "rgb(147 51 234 / var(--tw-bg-opacity))"
                                  : "",
                              }}
                              onChange={(checked) => field.onChange(checked)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <Button
                    variant={"none"}
                    className="bg-purple-600 font-bold px-10 text-white"
                    type="submit"
                  >
                    Thêm
                  </Button>
                </div>
              </form>
            </div>
          </FormProvider>
        </AccordionCustom>
        <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Danh sách gói tin đăng
        </h4>
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          dataSource={PackageTypeData}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => {
              getPackageTypes(page);
            },
          }}
          loading={loading}
        />
      </div>
    </main>
  );
};

export default PackageType;
