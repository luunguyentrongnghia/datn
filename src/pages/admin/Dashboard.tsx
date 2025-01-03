import { apigetPropertyTotal } from "@/apis/property";
import { apiGetUserTotal } from "@/apis/user";
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DatePicker } from "antd";
import { apigetRevenueByMonth } from "@/apis/transactions";
import dayjs from "dayjs";
const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};
const Dashboard = () => {
  const [TotalDashboard, setTotalDashboard] = useState({
    userOpen: 0,
    userLock: 0,
    PropertyPending: 0,
    PropertyApproved: 0,
  });
  const [RevenueByMonth, setRevenueByMonth] = useState([]);
  const [Year, setYear] = useState(new Date().getFullYear().toString());
  const getUserTotal = async (status: string) => {
    const response = await apiGetUserTotal(status);
    if (response.data.success) {
      setTotalDashboard((prevState) => ({
        ...prevState,
        [status === "lock" ? "userLock" : "userOpen"]: response.data.total,
      }));
    }
  };
  const getProprtyTotal = async (status: string) => {
    const response = await apigetPropertyTotal(status);
    if (response.data.success) {
      setTotalDashboard((prevState) => ({
        ...prevState,
        [status === "approved" ? "PropertyApproved" : "PropertyPending"]:
          response.data.total,
      }));
    }
  };
  const getRevenueByMonth = async (year: string) => {
    const query = `year=${year}`;
    const response = await apigetRevenueByMonth(query);
    if (response.status === 200) {
      setRevenueByMonth(response.data);
    }
  };
  const onChange = (date: any, dateString: any) => {
    setYear(dateString);
  };
  useEffect(() => {
    getUserTotal("open");
    getUserTotal("lock");
    getProprtyTotal("approved");
    getProprtyTotal("pending");
  }, []);
  useEffect(() => {
    getRevenueByMonth(Year);
  }, [Year]);
  return (
    <main className="h-full overflow-y-auto">
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Dashboard
        </h2>
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Tài khoản đang hoạt động
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {TotalDashboard.userOpen}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Tài khoản bị khóa
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {TotalDashboard.userLock}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
              <i className="fa-solid fa-newspaper w-6 h-5"></i>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Tin đăng đang hoạt động
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {TotalDashboard.PropertyApproved}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
              <i className="fa-solid fa-newspaper w-6 h-5"></i>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Tin đăng chưa xử lý
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {TotalDashboard.PropertyPending}
              </p>
            </div>
          </div>
        </div>
        <DatePicker
          onChange={onChange}
          picker="year"
          className="w-32 mb-3"
          defaultValue={dayjs(`${new Date().getFullYear()}`, "YYYY")}
        />
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
            <CardDescription>{`January - December ${Year}`} </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[400px] w-full" config={chartConfig}>
              <BarChart accessibilityLayer data={RevenueByMonth}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="revenue" fill="#6666FF" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          {/* <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter> */}
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
