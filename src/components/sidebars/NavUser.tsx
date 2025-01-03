import { pathnames } from "@/lib/pathnames";
import React from "react";

const NavUser = [
  {
    id: 1,
    label: "Cá nhân",
    path: pathnames.users.Layout + pathnames.users.personal,
    icon: <i className="fas fa-user text-sm"></i>,
  },
  {
    id: 2,
    label: "Đổi mật khẩu",
    path: pathnames.users.Layout + pathnames.users.updatePassword,
    icon: <i className="fa-solid fa-key"></i>,
  },
  {
    id: 3,
    label: "Quản lý tin đăng",
    path: pathnames.users.Layout + pathnames.users.managePost,
    icon: <i className="fa-solid fa-list text-sm"></i>,
  },
  {
    id: 4,
    label: "Thêm mới tin đăng",
    path: pathnames.users.Layout + pathnames.users.createPost,
    icon: <i className="fa-solid fa-map-location-dot text-sm"></i>,
  },
  {
    id: 5,
    label: "Quản lý liên hệ",
    path: pathnames.users.Layout + pathnames.users.Inquiries,
    icon: <i className="fa-solid fa-phone"></i>,
  },
  {
    id: 6,
    label: "Lịch sử giao dịch",
    path: pathnames.users.Layout + pathnames.users.paymentHistory,
    icon: <i className="fa-solid fa-receipt"></i>,
  },

  {
    id: 7,
    label: "Nạp tiền",
    path: pathnames.users.Layout + pathnames.users.deposit,
    icon: <i className="fa-solid fa-money-bill"></i>,
  },
];

export default NavUser;
