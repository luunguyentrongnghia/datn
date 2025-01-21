import {
  apigetTransactions,
  apigetTransactionsExcel,
} from "@/apis/transactions";
import { FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Modal, Select, Space, Table } from "antd";
import clsx from "clsx";
import { formatNumber } from "humanize-plus";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import useMeStore from "@/zustand/useMeStore";
const paymentHistory = () => {
  const { me, getMe } = useMeStore();
  const transactionType = {
    Recharge: "Nạp tiền",
    BuyPackages: "Mua gói tin",
    Refund: "Hoàn tiền",
  };
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
  const [query, setquery] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    search: "",
    DaysAgo: "",
    transaction_type: "",
    startDate: "",
    endDate: "",
  });
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getTransactions = async (queryValue?: any) => {
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
      if (queryValue.transaction_type != "") {
        queryData =
          queryData + `&transaction_type=${queryValue.transaction_type}`;
      }
      const response = await apigetTransactions(queryData);
      if (response.data.success) {
        setTransaction(response.data.data);
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
  const getTransactionsExcel = async (queryValue?: any) => {
    try {
      let queryData = "";
      if (queryValue.DaysAgo !== "") {
        queryData = queryData + `&DaysAgo=${queryValue.DaysAgo}`;
      } else if (queryValue.startDate !== "" && queryValue.endDate !== "") {
        queryData =
          queryData +
          `&startDate=${queryValue.startDate}` +
          `&endDate=${queryValue.endDate}`;
      }
      if (queryValue.transaction_type != "") {
        queryData =
          queryData + `&transaction_type=${queryValue.transaction_type}`;
      }
      await apigetTransactionsExcel(queryData);
      toast.success("Tải thành công");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTransactions(query);
  }, [
    query.current,
    query.pageSize,
    query.search,
    query.DaysAgo,
    query.transaction_type,
    query.endDate,
    query.startDate,
  ]);
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Loại giao dịch",
      dataIndex: "transaction_type",
      key: "transaction_type",
    },
    {
      title: "Cách thức",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Tiền giao dịch",
      dataIndex: "amount",
      key: "amount",
      render: (data: any, record: any) => {
        return (
          <p
            className={clsx(
              "font-bold ",
              record.transaction_type === transactionType.BuyPackages
                ? "text-red-500"
                : "text-green-600"
            )}
          >
            {record.transaction_type === transactionType.BuyPackages
              ? "-"
              : "+"}
            {formatNumber(Number(record.amount))} VNĐ
          </p>
        );
      },
    },
    {
      title: "Số dư",
      dataIndex: "balance",
      key: "balance",
      render: (data: any, record: any) => {
        return (
          <p className={"font-bold "}>
            {formatNumber(Number(record.balance))} VNĐ
          </p>
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
  ];
  const handleSearchDate = (data: any) => {
    setquery((prev) => ({
      ...prev,
      DaysAgo: "",
      endDate: data.endDate,
      startDate: data.startDate,
    }));
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1>Số dư:</h1>
        <p> {formatNumber(me.balance)} VND</p>
      </div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Select
            className="w-[200px] "
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
          <Select
            className="w-[200px]"
            placeholder={"Loại giao dịch"}
            onChange={(value) =>
              setquery((prev) => ({ ...prev, transaction_type: value }))
            }
          >
            <Select.Option key={"all"} value={""}>
              Tất cả
            </Select.Option>
            <Select.Option key={"naptien"} value={transactionType.Recharge}>
              Nạp tiền
            </Select.Option>
            <Select.Option key={"muagoi"} value={transactionType.BuyPackages}>
              Mua gói tin
            </Select.Option>
            <Select.Option key={"hoantien"} value={transactionType.Refund}>
              Hoàn tiền
            </Select.Option>
          </Select>
          <Button
            variant={"button1"}
            className="w-32 bg-green-600 font-bold"
            onClick={() => getTransactionsExcel(query)}
          >
            Excel
          </Button>
        </Space>
        <Table
          rowKey="id"
          dataSource={transaction}
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

export default paymentHistory;
