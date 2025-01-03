import { provinceTops } from "@/lib/constants";
import useAppStore from "@/zustand/useAppStore";
import React from "react";
import { Button } from "../ui/button";
interface SearchProperty {
  id: string;
  province: string;
  minPrice: number | null;
  maxPrice: number | null;
  maxSquareMeter: number | null;
  minSquareMeter: number | null;
  PropertyTypeId: string | null;
  listingType: string | null;
}
interface SelectProvinceType {
  onClose: () => void;
  setSearchProperty: React.Dispatch<React.SetStateAction<SearchProperty>>;
}
const SelectProvince = ({ onClose, setSearchProperty }: SelectProvinceType) => {
  const { provinces } = useAppStore();
  return (
    <div className="absolute top-full left-0 right-0 max-h-[500px] overflow-y-auto rounded-md rounded-t-none bg-slate-50 text-slate-900 ">
      <div className="flex items-center py-4 px-6 border-b border-input justify-between">
        <p className="font-bold text-sm text-slate-900">
          Bạn muốn tìm bất động sản ở tỉnh nào
        </p>
        <Button
          variant={"secondary"}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </Button>
      </div>
      <div className="text-sm text-slate-900 space-x-6 px-6 py-4">
        <div className="space-y-4">
          <p className="font-bold text-slate-400">Tất cả tỉnh thành nổi bật</p>
          <div className="flex items-center rounded-md justify-around gap-4">
            {provinceTops.map((el) => (
              <div
                key={el.id}
                className="aspect-[3/2] relative group rounded-md overflow-hidden flex-1 cursor-pointer"
              >
                <img
                  src={el.imgeUrl}
                  alt=""
                  className="h-full w-full rounded-md group-hover:animate-scale-up-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <p className="absolute left-0 right-0 bottom-2 text-white font-medium text-center">
                  {el.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="font-bold text-slate-400">Các tỉnh thành</p>
          <div className="grid grid-cols-6 gap-4">
            <p
              className="cursor-pointer hover:underline"
              onClick={() =>
                setSearchProperty((prev) => ({
                  ...prev,
                  id: "",
                  province: "Trên toàn quốc",
                }))
              }
            >
              Trên toàn quốc
            </p>
            {provinces.map((el) => (
              <p
                className="cursor-pointer hover:underline"
                onClick={() =>
                  setSearchProperty((prev) => ({
                    ...prev,
                    id: el.id,
                    province: el.name,
                  }))
                }
                key={el.id}
              >
                {el.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProvince;
