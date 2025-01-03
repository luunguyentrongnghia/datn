import { useEffect, useState } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import useMeStore from "./zustand/useMeStore";
import useAppStore from "./zustand/useAppStore";
import { useNavigate } from "react-router-dom";
import { pathnames } from "@/lib/pathnames";
import CustomModal from "./components/common/CustomModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  const { token, getMe, role } = useMeStore();
  const { isShowModal, getProvinces, getPropetyTypeBuy, getPropetyTypeLease } =
    useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    getProvinces();
  }, []);
  useEffect(() => {
    getMe();
    getPropetyTypeBuy();
    getPropetyTypeLease();
    if (!localStorage.getItem("addressHistory")) {
      localStorage.setItem(
        "addressHistory",
        JSON.stringify({
          provinceId: "",
          districtId: "",
          count: 0,
        })
      );
    }
  }, []);
  useEffect(() => {
    if (role === "admin") {
      navigate(pathnames.admin.Layout + pathnames.admin.dashboard);
    }
  }, [role]);
  return (
    <QueryClientProvider client={queryClient}>
      <main className="scroll-smooth">
        {isShowModal && <CustomModal />}
        <Outlet />
        <Toaster position="top-center" expand={false} richColors />
      </main>
    </QueryClientProvider>
  );
}

export default App;
