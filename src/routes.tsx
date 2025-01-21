import React from "react";
import App from "./App";
import { Auth } from "./components/auths";
import { pathnames } from "./lib/pathnames";
import { Dashboard, TypeProperty } from "./pages/admin";
import AdminLayout from "./pages/admin/AdminLayout";
import PackageType from "./pages/admin/PackageType";
import Property from "./pages/admin/Property";
import ReportProperty from "./pages/admin/ReportProperty";
import User from "./pages/admin/User";
import { Homepage, News, PublicLayout, PropertyUser } from "./pages/publics";
import DetailProperty from "./pages/publics/DetailProperty";
import {
  CreatePost,
  ManagePost,
  Payment,
  PaymentHistory,
  Personal,
  UpdatePassword,
  UserLayout,
} from "./pages/users";
import Inquiries from "./pages/users/inquiries/Inquiries";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: pathnames.publics.Layout,
        element: <PublicLayout />,
        children: [
          {
            path: pathnames.publics.homePage,
            element: <Homepage />,
          },
          {
            path: pathnames.publics.news,
            element: <News />,
          },
          {
            path: pathnames.publics.mainListingsRoute,
            element: <PropertyUser />,
          },
          {
            path: pathnames.publics.detailedListingsRoute,
            element: <PropertyUser />,
          },
          {
            path: pathnames.publics.property,
            element: <PropertyUser />,
          },
          {
            path: pathnames.publics.detailProperty,
            element: <DetailProperty />,
          },
        ],
      },
      {
        path: pathnames.users.Layout,
        element: <UserLayout />,
        children: [
          {
            path: pathnames.users.personal,
            element: <Personal />,
          },
          {
            path: pathnames.users.createPost,
            element: <CreatePost />,
          },
          {
            path: pathnames.users.managePost,
            element: <ManagePost />,
          },
          {
            path: pathnames.users.updatePassword,
            element: <UpdatePassword />,
          },
          {
            path: pathnames.users.paymentHistory,
            element: <PaymentHistory />,
          },
          {
            path: pathnames.users.deposit,
            element: <Payment />,
          },
          {
            path: pathnames.users.Inquiries,
            element: <Inquiries />,
          },
        ],
      },
      {
        path: pathnames.login,
        element: <Auth />,
      },
      {
        path: pathnames.admin.Layout,
        element: <AdminLayout />,
        children: [
          {
            path: pathnames.admin.dashboard,
            element: <Dashboard />,
          },
          {
            path: pathnames.admin.typeProperty,
            element: <TypeProperty />,
          },
          {
            path: pathnames.admin.typePackage,
            element: <PackageType />,
          },
          {
            path: pathnames.admin.property,
            element: <Property />,
          },
          {
            path: pathnames.admin.user,
            element: <User />,
          },
          {
            path: pathnames.admin.reportProperty,
            element: <ReportProperty />,
          },
        ],
      },
    ],
  },
];

export default routes;
