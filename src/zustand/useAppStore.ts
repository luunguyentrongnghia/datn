import {
  apiGetDistricts,
  apiGetProvinces,
  apiGetWards,
} from "@/apis/externals";
import { apigetPackageTypeAll, apigetPropertyTypeAdmin } from "@/apis/property";
import { apiGetMe } from "@/apis/user";
import { create } from "zustand";
interface Province {
  name: string;
  id: string;
}
interface Districts {
  name: string;
  id: string;
}
interface Wards {
  name: string;
  id: string;
}
interface PackageType {
  id: string;
  name: string;
  price?: string;
  priority_level: number;
  isShowDecription: boolean;
  isShowDetails: boolean;
  isShowContactInfo: boolean;
  isShowOwnerName: boolean;
}
interface propetyType {
  id: string;
  name: string;
  listingType: string;
}
// Định nghĩa interface cho store
interface useAppStore {
  provinces: Province[];
  districts: Districts[];
  wards: Wards[];
  PackageType: PackageType[];
  propetyTypeBuy: propetyType[];
  propetyTypeLease: propetyType[];
  isShowModal: boolean;
  contentModal: any;
  getProvinces: () => Promise<void>;
  getPackageTypes: () => Promise<void>;
  getPropetyTypeBuy: () => Promise<void>;
  getPropetyTypeLease: () => Promise<void>;
  getDistrictsFromIdProvince: (idProvince: string) => Promise<void>;
  getWardsFromIdDistrict: (idDistrict: string) => Promise<void>;
  setModal: (isShowModal?: boolean, contentModal?: any) => void;
}

// Tạo store bằng Zustand
const useAppStore = create<useAppStore>()((set, get) => ({
  provinces: [],
  districts: [],
  wards: [],
  PackageType: [],
  propetyTypeBuy: [],
  propetyTypeLease: [],
  isShowModal: false,
  contentModal: null,
  setModal: (isShowModal?: boolean, contentModal?: any) =>
    set(() => ({ isShowModal, contentModal })),
  getProvinces: async () => {
    const response = await apiGetProvinces();
    if (response.status === 200) {
      return set(() => ({ provinces: response.data.data }));
    } else {
      return set(() => ({ provinces: [] }));
    }
  },
  getPackageTypes: async () => {
    const response = await apigetPackageTypeAll();
    if (response.status === 200) {
      return set(() => ({ PackageType: response.data.data }));
    } else {
      return set(() => ({ PackageType: [] }));
    }
  },
  getDistrictsFromIdProvince: async (idProvince: string) => {
    const response = await apiGetDistricts(`idProvince=${idProvince}`);
    if (response.status === 200) {
      return set(() => ({ districts: response.data.data }));
    } else {
      return set(() => ({ districts: [] }));
    }
  },
  getWardsFromIdDistrict: async (idDistrict: string) => {
    const response = await apiGetWards(`idDistrict=${idDistrict}`);
    if (response.status === 200) {
      return set(() => ({ wards: response.data.data }));
    } else {
      return set(() => ({ wards: [] }));
    }
  },
  getPropetyTypeBuy: async () => {
    const response = await apigetPropertyTypeAdmin("listingType=bán");
    if (response.status === 200) {
      return set(() => ({ propetyTypeBuy: response.data.data }));
    } else {
      return set(() => ({ propetyTypeBuy: [] }));
    }
  },
  getPropetyTypeLease: async () => {
    const response = await apigetPropertyTypeAdmin("listingType=cho thuê");
    if (response.status === 200) {
      return set(() => ({ propetyTypeLease: response.data.data }));
    } else {
      return set(() => ({ propetyTypeLease: [] }));
    }
  },
}));

export default useAppStore;
