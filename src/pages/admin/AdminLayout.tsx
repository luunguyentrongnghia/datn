import { Aside } from "@/components/admin/aside";
import { pathnames } from "@/lib/pathnames";
import useMeStore from "@/zustand/useMeStore";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "@/components/admin/header/Header";
const AdminLayout = () => {
  const { role } = useMeStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "admin") {
      navigate(pathnames.publics.Layout);
    }
  }, [role]);
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Aside />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
