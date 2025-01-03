import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PopoverRange from "./PopoverRange";
import SelectProvince from "./SelectProvince";
import { prices, sizes } from "@/lib/constants";
import PopoverCheckBox from "./PopoverCheckBox";
import useAppStore from "@/zustand/useAppStore";
import { pathnames } from "@/lib/pathnames";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
const postTypes = ["bán", "cho thuê"].map((el, idx) => ({
  id: idx,
  label: el,
  value: el,
}));
interface SearchProperty {
  id: string;
  province: string;
  minPrice: number | null;
  maxPrice: number | null;
  minSquareMeter: number | null;
  maxSquareMeter: number | null;
  PropertyTypeId: string | null;
  listingType: string | null;
}
const Search = () => {
  const [activedTab, setActivedTab] = useState("cho thuê");
  const [SearchProperty, setSearchProperty] = useState<SearchProperty>({
    id: "",
    province: "Trên toàn quốc",
    minPrice: null,
    maxPrice: null,
    minSquareMeter: null,
    maxSquareMeter: null,
    PropertyTypeId: null,
    listingType: null,
  });
  const [isShowSelectProvince, setIsShowSelectProvince] = useState(false);
  const { propetyTypeBuy, propetyTypeLease } = useAppStore();
  const navigate = useNavigate();
  const handleSearch = (event: any) => {
    event.stopPropagation();
    let LinkUrl = pathnames.publics.Layout + pathnames.publics.property;
    let params: any = {};
    if (activedTab === "bán") {
      LinkUrl = LinkUrl + "bán";
    } else {
      LinkUrl = LinkUrl + "cho thuê";
    }
    if (SearchProperty.PropertyTypeId !== null) {
      LinkUrl = LinkUrl + "/" + SearchProperty.PropertyTypeId;
    }
    if (SearchProperty.minPrice) {
      params["minPrice"] = SearchProperty.minPrice;
    }
    if (SearchProperty.maxPrice) {
      params["maxPrice"] = SearchProperty.maxPrice;
    }
    if (SearchProperty.minSquareMeter) {
      params["minSquareMeter"] = SearchProperty.minSquareMeter;
    }
    if (SearchProperty.maxSquareMeter) {
      params["maxSquareMeter"] = SearchProperty.maxSquareMeter;
    }
    const queryParams = new URLSearchParams(params);
    navigate(`${LinkUrl}?${queryParams.toString()}`, {
      state: { listingType: activedTab },
    });
  };
  return (
    <div className=" absolute top-0 bottom-0 left-20 right-20 text-slate-50 grid place-content-center">
      <div className=" w-[945px] max-w-full">
        <Tabs
          className="space-y-0"
          onValueChange={(value) => setActivedTab(value)}
          defaultValue={activedTab}
        >
          <TabsList className=" bg-slate-50 p-0 bg-transparent">
            {postTypes.map((el) => (
              <TabsTrigger
                className="data-[state=active]:bg-black/60 h-full first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-slate-50 bg-slate-50 text-slate-950 min-w-[81px]"
                value={el.value}
                key={el.id}
              >
                {el.label.toLocaleUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          {postTypes.map((el) => (
            <TabsContent
              className="bg-black/60 rounded-md space-y-4 text-sm rounded-tl-none p-4"
              key={el.id}
              value={el.value}
            >
              <div
                onClick={() => setIsShowSelectProvince(true)}
                className={clsx(
                  "flex relative items-center justify-between bg-slate-50 rounded-md  px-[6px] py-[2px]",
                  isShowSelectProvince && "rounded-b-none"
                )}
              >
                <p className="text-sm flex items-center gap-2 font-semibold text-slate-900">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>{SearchProperty.province}</span>
                </p>
                <Button onClick={handleSearch}>Tìm kiếm</Button>
                {isShowSelectProvince && (
                  <SelectProvince
                    onClose={() => setIsShowSelectProvince(false)}
                    setSearchProperty={setSearchProperty}
                  />
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <PopoverRange
                  name="price"
                  option={prices}
                  minValue={0}
                  maxValue={10000000000}
                  label="Mức giá"
                  setSearchProperty={setSearchProperty}
                />
                <PopoverRange
                  name="size"
                  option={sizes}
                  minValue={0}
                  maxValue={500}
                  label="Diện tích"
                  setSearchProperty={setSearchProperty}
                />
                <PopoverCheckBox
                  label="Loại tin đăng"
                  option={
                    activedTab === "bán"
                      ? propetyTypeBuy.map((el) => ({
                          id: el.id,
                          value: {
                            id: el.id,
                            listingType: el.listingType,
                          },
                          label: el.name,
                        }))
                      : propetyTypeLease.map((el) => ({
                          id: el.id,
                          label: el.name,
                          value: {
                            id: el.id,
                            listingType: el.listingType,
                          },
                        }))
                  }
                  setSearchProperty={setSearchProperty}
                  name="postType"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Search;
