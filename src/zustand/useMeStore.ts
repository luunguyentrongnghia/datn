import { apiLogout } from "@/apis/auth";
import { apiGetMe } from "@/apis/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Định nghĩa interface cho store
interface MeStore {
  setGoogleData: (data: object) => void;
  setRegisterPhone: (data: object) => void;
  setToken: (token: string) => void;
  setMe: (me: any) => void;
  token: string | null;
  me: any;
  googleData: object | null;
  registerPhone: object | null;
  role: string | null;
  getMe: () => Promise<void>;
  logout: () => void;
}

// Tạo store bằng Zustand
const useMeStore = create<MeStore>()(
  (set, get) => ({
    token: null, // Khởi tạo state cho token
    me: null, // Khởi tạo state cho thông tin người dùng
    googleData: null, // Khởi tạo state cho dữ liệu từ Google
    registerPhone: null,
    role: null,
    setRegisterPhone: (data: object) => set(() => ({ registerPhone: data })),
    setToken: (token: string) => set({ token }), // Cập nhật token
    setMe: (me: any) => set({ me }), // Cập nhật thông tin người dùng
    setGoogleData: (data: object) => set(() => ({ googleData: data })), // Cập nhật Google data
    getMe: async () => {
      const user = await apiGetMe();
      if (user.status === 200 && user.data) {
        set(() => ({ me: user.data, role: user.data.role }));
      } else {
        set(() => ({ me: null, token: null }));
      }
    },
    logout: async () => {
      await apiLogout();
      set(() => ({
        token: null,
        me: null,
        role: null,
      }));
    },
  })
  // persist(
  //   {
  //     name: "DATN-BDS/me",
  //     storage: createJSONStorage(() => localStorage), // Lưu trữ vào localStorage
  //     partialize: (state) =>
  //       Object.fromEntries(
  //         Object.entries(state).filter(
  //           ([key]) => key === "token" || key === "me"
  //         )
  //       ),
  //   }
  // )
);

export default useMeStore;
