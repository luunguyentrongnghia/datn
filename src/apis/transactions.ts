import axios, { endpoints } from "./axios";

export const apigetTransactions = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.transactions + `?${query}`,
  });
export const apigetRevenueByMonth = (query?: string) =>
  axios({
    method: "get",
    url: endpoints.getRevenueByMonth + `?${query}`,
  });
export const apigetTransactionsExcel = async (query?: string) => {
  try {
    const response = await axios({
      method: "get",
      url: endpoints.transactionsExcel + `?${query}`,
      responseType: "blob",
    });
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "baocao.xlsx");
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } else {
      throw new Error("Lỗi không thể xuất báo cáo");
    }
  } catch (error) {
    console.error("Lỗi không thể xuất báo cáo:", error);
    throw error;
  }
};
