import { Footer } from "@/components/footer";
import { Header } from "@/components/headers";
import { UserSidebar } from "@/components/sidebars";
import { pathnames } from "@/lib/pathnames";
import useMeStore from "@/zustand/useMeStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

const UserLayout = () => {
  const { me } = useMeStore();
  if (!me) {
    toast.info("Vui lòng đăng nhập");
    return <Navigate to={pathnames.publics.Layout} />;
  }
  return (
    <div>
      <Header />
      <div className="container pt-10 pb-90px lg:pb-30">
        <div className="container pb-50px">
          <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px">
            <span className="leading-1.3 md:leading-1.3 lg:leading-1.3 xl:leading-1.3">
              Tài khoản
            </span>
          </h1>
          <ul className="breadcrumb flex gap-30px items-center text-sm lg:text-base font-bold pt-4">
            <li className="home relative leading-1.8 lg:leading-1.8">
              <a href="/">
                <i className="fas fa-home text-secondary-color"></i> Trang chu
              </a>
            </li>
            <li className="leading-1.8 lg:leading-1.8 text-heading-color">
              Tai khoan
            </li>
          </ul>
        </div>
        <div className="tab account-tab grid grid-cols-1 lg:grid-cols-12 gap-x-30px gap-y-50px">
          <UserSidebar />
          <div className="tab-contents  lg:col-span-9">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
