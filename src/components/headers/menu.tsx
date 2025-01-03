import { pathnames } from "@/lib/pathnames";

const menu = [
  {
    id: 1,
    label: "Cá nhân",
    path: pathnames.users.Layout + pathnames.users.personal,
    icon: <i className="fas fa-user text-sm"></i>,
  },
  {
    id: 2,
    label: "Lịch sử giao dịch",
    path: pathnames.users.Layout + pathnames.users.paymentHistory,
    icon: <i className="fa-solid fa-money-check-dollar text-sm"></i>,
  },
  {
    id: 3,
    label: "Quản lý tin đăng",
    path: pathnames.users.Layout + pathnames.users.managePost,
    icon: <i className="fa-solid fa-list text-sm"></i>,
  },
  {
    id: 4,
    label: "Nạp tiền",
    path: pathnames.users.Layout + pathnames.users.deposit,
    icon: <i className="fa-solid fa-money-bill"></i>,
  },
];

export default menu;
