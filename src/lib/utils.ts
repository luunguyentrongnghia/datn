import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Humanize from "humanize-plus";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const generateDefaultAvatar = (name: string) =>
  `https://ui-avatars.com/api/?background=random&color=random&name=${encodeURIComponent(
    name
  )}&rounded=true&bold=true`;

export const checkEmailOrPhone = (
  value: string
): "email" | "phone" | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:\+84|0)(?:\d{9}|\d{8})$/;
  if (emailRegex.test(value)) {
    return "email";
  } else if (phoneRegex.test(value)) {
    return "phone";
  }
};
export const CurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
export const formayPrice = (price: number) => {
  const units = [
    { value: 1000000000, label: "tỷ" },
    { value: 1000000, label: "triệu" },
    { value: 1000, label: "ngàn" },
  ];
  let result = "";
  for (const unit of units) {
    const unitValue = Math.floor(price / unit.value);
    if (unitValue > 0) {
      result += `${Humanize.intComma(unitValue)} ${unit.label} `;
      price %= unit.value;
    }
  }

  return result.trim();
};
// export const geocodeAddress = async (address: string) => {
//   const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//     address
//   )}&format=json`;
//   const response = await fetch(url);
//   const data = await response.json();

//   if (data && data.length > 0 && data[0]) {
//     console.log(data);
//     const latitude = data[0]?.lat;
//     const longitude = data[0]?.lon;
//     return {
//       latitude,
//       longitude,
//     };
//   } else {
//     console.log("Không tìm thấy địa điểm.");
//     return {
//       latitude: null,
//       longitude: null,
//     };
//   }
// };
export const geocodeAddress = async (address: string) => {
  const url = `https://us1.locationiq.com/v1/search?key=pk.bece75438f7285198d46a74cb1926599&q=${encodeURIComponent(
    address
  )}&format=json`;
  const response = await fetch(url);
  const data = await response.json();

  if (data && data.length > 0 && data[0]) {
    console.log(data);
    const latitude = data[0]?.lat;
    const longitude = data[0]?.lon;
    return {
      latitude,
      longitude,
    };
  } else {
    console.log("Không tìm thấy địa điểm.");
    return {
      latitude: null,
      longitude: null,
    };
  }
};
// export const formatNumber=()=>{

// }
