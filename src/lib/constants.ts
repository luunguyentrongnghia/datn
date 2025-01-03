import slugify from "slugify";

export const postSoldTypes = [
  "Căn hộ chung cư",
  "Nhà mặt phố",
  "Nhà riêng",
  "Nhà phố thương mại",
  "Biệt thự",
  "Đất nền",
  "Bán đất",
  "Trang trại",
  "Khu nghỉ dương",
  "Kho",
  "Nhà xưởng",
  "Khác",
].map((el) => ({ name: el, pathname: slugify(el) }));

export const postRentTypes = [
  "Căn hộ chung cư",
  "Nhà mặt phố",
  "Nhà riêng",
  "Nhà phố thương mại",
  "Biệt thự",
  "Đất nền",
  "Bán đất",
  "Trang trại",
  "Khu nghỉ dương",
  "Kho",
  "Nhà xưởng",
  "Khác",
].map((el) => ({ name: el, pathname: slugify(el) }));
export const banners = [
  "/jpg/frames-for-your-heart-2d4lAQAlbDA-unsplash.jpg",
  "/jpg/kara-eads-L7EwHkq1B2s-unsplash.jpg",
  "/jpg/vita-vilcina-KtOid0FLjqU-unsplash.jpg",
  "/jpg/webaliser-_TPTXZd9mOo-unsplash.jpg",
].map((el, idx) => ({
  id: idx,
  imageUrl: el,
}));

export const provinceTops = [
  {
    id: 1,
    imgeUrl: "/hanoi.jpg",
    label: "Hà nội",
  },
  {
    id: 2,
    imgeUrl: "/tphcm.jpg",
    label: "Hồ Chí Minh",
  },
  {
    id: 3,
    imgeUrl: "/haiphong.jpeg",
    label: "Hải Phòng",
  },
  {
    id: 4,
    imgeUrl: "/danang.jpg",
    label: "Đà Nẳng",
  },
  {
    id: 5,
    imgeUrl: "/quangninh.jpg",
    label: "Quảng Ninh",
  },
  {
    id: 6,
    imgeUrl: "/binhduong.jpg",
    label: "Bình Dương",
  },
];
export const prices = [
  {
    id: 1,
    label: "tất cả mức giá",
    value: [null, null],
  },
  {
    id: 2,
    label: "Dưới 500 triệu",
    value: [0, 0.5 * Math.pow(10, 9)],
  },
  {
    id: 3,
    label: "Từ 500 triệu tới 800 triệu",
    value: [0.5 * Math.pow(10, 9), 0.8 * Math.pow(10, 9)],
  },
  {
    id: 4,
    label: "Trên 800 triệu tới 1 tỷ",
    value: [0.8 * Math.pow(10, 9), 1 * Math.pow(10, 9)],
  },
  {
    id: 5,
    label: "Trên 1 tỷ tới 2 tỷ",
    value: [1 * Math.pow(10, 9), 2 * Math.pow(10, 9)],
  },
  {
    id: 6,
    label: "Trên 2 tỷ tới 3 tỷ",
    value: [2 * Math.pow(10, 9), 3 * Math.pow(10, 9)],
  },
  {
    id: 7,
    label: "Trên 3 tỷ tới 5 tỷ",
    value: [3 * Math.pow(10, 9), 5 * Math.pow(10, 9)],
  },
  {
    id: 8,
    label: "Trên 5 tỷ tới 7 tỷ",
    value: [5 * Math.pow(10, 9), 7 * Math.pow(10, 9)],
  },
  {
    id: 9,
    label: "Trên 7 tỷ tới 10 tỷ",
    value: [7 * Math.pow(10, 9), 10 * Math.pow(10, 9)],
  },
  {
    id: 10,
    label: "Trên 10 tỷ",
    value: [10 * Math.pow(10, 9), 0],
  },
  {
    id: 11,
    label: "Dưới 10 tỷ",
    value: [0, 10 * Math.pow(10, 9)],
  },
];
export const sizes = [
  {
    id: 1,
    label: "tất cả diện tích",
    value: [null, null],
  },
  {
    id: 2,
    label: "Dưới 30 m2",
    value: [0, 30],
  },
  {
    id: 3,
    label: "Từ 30 m2 đến 50m2",
    value: [30, 50],
  },
  {
    id: 4,
    label: "Trên 50 m2 đến 80m2",
    value: [50, 80],
  },
  {
    id: 5,
    label: "Trên 80 m2 đến 100m2",
    value: [80, 100],
  },
  {
    id: 6,
    label: "Trên 100 m2 đến 150m2",
    value: [100, 150],
  },
  {
    id: 7,
    label: "Trên 150 m2 đến 200m2",
    value: [150, 200],
  },
  {
    id: 8,
    label: "Trên 200 m2 đến 250m2",
    value: [200, 250],
  },
  {
    id: 9,
    label: "Trên 250 m2 đến 300m2",
    value: [250, 300],
  },
  {
    id: 10,
    label: "Trên 300 m2 đến 500m2",
    value: [300, 500],
  },
  {
    id: 11,
    label: "Trên 500 m2",
    value: [500, 0],
  },
  {
    id: 12,
    label: "dưới 500 m2",
    value: [0, 500],
  },
];
export const sortProperty = [
  {
    id: 1,
    label: "Giá cao đến thấp",
    value: "sortPrice=DESC",
  },
  {
    id: 2,
    label: "Giá thấp đến cao",
    value: "sortPrice=ASC",
  },
  {
    id: 3,
    label: "Diện tích lớn đến bé",
    value: "sortSquareMeter=DESC",
  },
  {
    id: 4,
    label: "Diện tích bé đến lớn",
    value: "sortSquareMeter=ASC",
  },
];
