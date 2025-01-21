import { pathnames } from "@/lib/pathnames";
import React from "react";

const MenuAdmin = [
  {
    id: 1,
    label: "Dashboard",
    path: pathnames.admin.Layout + pathnames.admin.dashboard,
    icon: <i className="fa-solid fa-tv"></i>,
  },
  {
    id: 2,
    label: "Quản lí người dùng",
    path: pathnames.admin.Layout + pathnames.admin.user,
    icon: <i className="fa-solid fa-users"></i>,
  },
  {
    id: 3,
    label: "Loại tin đăng",
    path: pathnames.admin.Layout + pathnames.admin.typeProperty,
    icon: <i className="fa-solid fa-layer-group"></i>,
  },
  {
    id: 4,
    label: "Gói tin đăng",
    path: pathnames.admin.Layout + pathnames.admin.typePackage,
    icon: <i className="fa-solid fa-box"></i>,
  },
  {
    id: 5,
    label: "Quản lí tin đăng",
    path: pathnames.admin.Layout + pathnames.admin.property,
    icon: <i className="fa-solid fa-newspaper"></i>,
  },
  {
    id: 6,
    label: "Báo cáo",
    path: pathnames.admin.Layout + pathnames.admin.reportProperty,
    icon: <i className="fa-solid fa-flag"></i>,
  },
];

export default MenuAdmin;
