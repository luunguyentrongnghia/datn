export const pathnames = {
  admin: {
    Layout: "/admin/",
    dashboard: "dashboard",
    typeProperty: "typeProperty",
    typePackage: "typePackage",
    property: "property",
    user: "user",
  },
  login: "/login",
  register: "/register",
  publics: {
    Layout: "/",
    homePage: "",
    news: "tin-tuc",
    property: "danh-sach-tin-dang/",
    mainListingsRoute: "danh-sach-tin-dang/:listingType",
    detailedListingsRoute: "danh-sach-tin-dang/:listingType/:idPropertyType",
    detailProperty: "chi-tiet-tin-dang/:idProperty",
  },
  users: {
    Layout: "/thanh-vien/",
    personal: "ca-nhan",
    general: "tong-quan",
    createPost: "tao-moi-tin-dang",
    managePost: "quan-ly-tin-dang",
    updatePassword: "doi-mat-khau",
    deposit: "nap-tien",
    paymentHistory: "lich-su-giao-dich",
    Inquiries: "quan-ly-lien-he",
  },
};