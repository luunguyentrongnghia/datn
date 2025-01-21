import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Form, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  apicreatePropertyType,
  apideletePropertyType,
  apigetPropertyTypeAdmin,
  apiupdatePropertyType,
} from "@/apis/property";
import { toast } from "sonner";
import { Switch, Table } from "antd";
import { AccordionCustom } from "@/components/admin/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import moment from "moment";
import { FormInput } from "@/components/forms";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { SheetCustom } from "@/components/admin/sheet";
import { Button } from "@/components/ui/button";
import FormSelectAntd from "@/components/forms/FormSelectAntd";
const formSchema = () =>
  z.object({
    name: z.string().min(1, { message: "trường này là bắt buộc." }),
    listingType: z.string().min(1, { message: "trường này là bắt buộc." }),
    direction: z.boolean(),
    balonDirection: z.boolean(),
    floor: z.boolean(),
    bedroom: z.boolean(),
    bathroom: z.boolean(),
    isFurniture: z.boolean(),
    Road: z.boolean(),
    Legal: z.boolean(),
    ResidentialArea: z.boolean(),
    Horizontal: z.boolean(),
    Length: z.boolean(),
    Land_status: z.boolean(),
    Deposit_amount: z.boolean(),
  });
const TypeProperty = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [PropertyTypeData, setPropertyTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    getPropertyTypes(pagination.current);
  }, [pagination.current, pagination.pageSize]);
  const form = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      name: "",
      listingType: "",
      direction: false,
      balonDirection: false,
      floor: false,
      bedroom: false,
      bathroom: false,
      isFurniture: false,
      Road: false,
      Legal: false,
      ResidentialArea: false,
      Horizontal: false,
      Length: false,
      Land_status: false,
      Deposit_amount: false,
    },
  });
  const form2 = useForm({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      name: "",
      listingType: "",
      direction: false,
      balonDirection: false,
      floor: false,
      bedroom: false,
      bathroom: false,
      isFurniture: false,
      Road: false,
      Legal: false,
      ResidentialArea: false,
      Horizontal: false,
      Length: false,
      Land_status: false,
      Deposit_amount: false,
    },
  });
  const getPropertyTypes = async (pageNumber?: number) => {
    const query = `page=${pageNumber}`;
    setLoading(true);
    try {
      const response = await apigetPropertyTypeAdmin(query);
      if (response.data.success) {
        setPropertyTypeData(response.data.data);
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
  const onSubmit = async (data: any) => {
    const response = await apicreatePropertyType(data);
    if (response.data.success) {
      toast.success(response.data.msg);
      form.reset();
      getPropertyTypes();
    } else {
      toast.error(response.data.msg);
    }
  };
  const handleDelete = async () => {
    if (selectedRowKeys.length > 0) {
      const response = await apideletePropertyType({ ids: selectedRowKeys });
      if (response.data.affected > 0) {
        getPropertyTypes();
        toast.success("Xóa thành công");
      } else {
        toast.success("Có lổi xảy ra");
      }
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
  const handleUpdatePropertyType = async (data: any, record: any) => {
    const response = await apiupdatePropertyType(data, record.id);
    if (response.data.affected > 0) {
      toast.success("Cập nhật thành công");
      getPropertyTypes();
    } else {
      toast.error("Lổi không thể cập nhật");
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => index + 1, // Sử dụng `index + 1` để đánh số thứ tự
    },
    {
      title: "Hình thức",
      dataIndex: "listingType",
      key: "listingType",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Tên hình thức",
      dataIndex: "name",
      key: "name",
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
                  form2.setValue("listingType", record.listingType);
                  form2.setValue("direction", record.direction);
                  form2.setValue("balonDirection", record.balonDirection);
                  form2.setValue("floor", record.floor);
                  form2.setValue("bedroom", record.bedroom);
                  form2.setValue("bathroom", record.bathroom);
                  form2.setValue("isFurniture", record.isFurniture);
                  form2.setValue("Road", record.Road);
                  form2.setValue("Legal", record.Legal);
                  form2.setValue("ResidentialArea", record.ResidentialArea);
                  form2.setValue("Horizontal", record.Horizontal);
                  form2.setValue("Length", record.Length);
                  form2.setValue("Land_status", record.Land_status);
                  form2.setValue("Deposit_amount", record.Deposit_amount);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </SheetTrigger>
            <SheetCustom
              form={form2}
              title="chỉnh sửa loại tin đăng"
              onSubmit={(data) => handleUpdatePropertyType(data, record)}
              classNameSheet="!max-w-[1000px]"
            >
              <FormSelectAntd
                form={form2}
                name="listingType"
                label="Hình thức:"
                ClassNameLable="text-gray-700 dark:text-gray-400"
                classSelect="block w-[50%]"
                Placeholder="Chọn hình thức"
                options={[
                  { label: "bán", value: "bán" },
                  { label: "cho thuê", value: "cho thuê" },
                ]}
              />
              <FormInput
                form={form2}
                type="text"
                name="name"
                Placeholder="VD:Cho thuê nhà"
                label="Tên hình thức:"
                ClassNameLable="text-gray-700 dark:text-gray-400"
                ClassNameInput="text-black"
              />
              <div className="grid grid-cols-5 gap-4">
                <FormField
                  name="direction"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Hướng:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.direction}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="balonDirection"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Hướng ban công:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.balonDirection}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="floor"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Số tầng:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.floor}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="bedroom"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Số phòng ngủ:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.bedroom}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="bathroom"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Số phòng tắm:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.bathroom}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="isFurniture"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Nội thất:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.isFurniture}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="Road"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Đường:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.Road}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="Legal"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Pháp lí:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.Legal}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="ResidentialArea"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        diện tích đất thổ cư:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.ResidentialArea}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="Horizontal"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Chiều ngang:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.Horizontal}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="Length"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Chiều dài:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.Length}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="Land_status"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Trạng thái đất:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.Land_status}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="Deposit_amount"
                  control={form2.control}
                  render={({ field }: { field: any }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-400">
                        Tiền cọc:
                      </FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={record.Deposit_amount}
                          className="block"
                          onChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
          Loại tin đăng
        </h2>
        <AccordionCustom title="Thêm loại tin đăng">
          <FormProvider {...form}>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <form
                className="block mt-4 text-sm "
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormSelectAntd
                  form={form}
                  name="listingType"
                  label="Hình thức:"
                  ClassNameLable="text-gray-700 dark:text-gray-400"
                  classSelect="block w-[50%]"
                  Placeholder="Chọn hình thức"
                  options={[
                    { label: "bán", value: "bán" },
                    { label: "cho thuê", value: "cho thuê" },
                  ]}
                />
                <FormInput
                  form={form}
                  type="text"
                  name="name"
                  Placeholder="VD:Cho thuê nhà"
                  label="Tên hình thức:"
                  ClassNameLable="text-gray-700 dark:text-gray-400"
                  ClassNameInput="text-black"
                />
                <div className="grid grid-cols-5 gap-4">
                  <FormField
                    name="direction"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Hướng:
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
                    name="balonDirection"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Hướng ban công:
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
                    name="floor"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Số tầng:
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
                    name="bedroom"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Số phòng ngủ:
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
                    name="bathroom"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Số phòng tắm:
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
                    name="isFurniture"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Nội thất:
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
                    name="Road"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Đường:
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
                    name="Legal"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Pháp lí:
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
                    name="ResidentialArea"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          diện tích đất thổ cư:
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
                    name="Horizontal"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Chiều ngang:
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
                    name="Length"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Chiều dài:
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
                    name="Land_status"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Trạng thái đất:
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
                    name="Deposit_amount"
                    control={form.control}
                    render={({ field }: { field: any }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-700 dark:text-gray-400">
                          Tiền cọc:
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
          Danh sách loại tin đăng
        </h4>
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          dataSource={PropertyTypeData}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => {
              getPropertyTypes(page);
            },
          }}
          loading={loading}
        />
      </div>
    </main>
  );
};

export default TypeProperty;
