import { apigetProperty } from "@/apis/property";
import { BannerSlider } from "@/components/layous";
import CarouselPropertyHorizontal from "@/components/layous/CarouselPropertyHorizontal";
import ListPropertySuggest from "@/components/listProperty/ListPropertySuggest";
import { Search } from "@/components/searchs";
import { useQuery } from "@tanstack/react-query";
import React from "react";
type PropertySuggest = [
  "fetchPropertySuggest",
  { provinceId: string; districtId: string }
];

const Homepage = () => {
  const getProperty = async (
    provinceId = "",
    districtId = "",
    packageTypeId = ""
  ) => {
    let query = `provinceId=${provinceId}&districtId=${districtId}&items_per_page=6&packageTypeId${packageTypeId}`;
    const response = await apigetProperty(query);

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  };
  const queryKey: PropertySuggest = [
    "fetchPropertySuggest",
    {
      provinceId:
        localStorage.getItem("addressHistory") &&
        JSON.parse(localStorage.getItem("addressHistory") || "").provinceId,
      districtId:
        localStorage.getItem("addressHistory") &&
        JSON.parse(localStorage.getItem("addressHistory") || "").districtId,
    },
  ];
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async ({ queryKey }) => {
      return getProperty(queryKey[1].provinceId, queryKey[1].districtId);
    },
  });
  return (
    <main>
      <div className="relative">
        <BannerSlider />
        <div>
          <Search />
        </div>
      </div>
      <div className="container pt-10 pb-70px modal-container">
        <div className="text-center mb-50px">
          <h2 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-44px text-heading-color font-bold">
            <span className="leading-1.3">Bất động sản nổi bật </span>
          </h2>
        </div>
        <CarouselPropertyHorizontal packageTypeLevel={"3"} />
      </div>
      <div className="container pt-10 pb-70px modal-container">
        <div className="text-center mb-50px">
          <h2 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-44px text-heading-color font-bold">
            <span className="leading-1.3">Bất động sản dành cho bạn </span>
          </h2>
        </div>
        {data && (
          <div className="-mx-15px">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((el: any, index: any) => (
                <ListPropertySuggest key={index} prop={el} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="container pt-10 pb-70px modal-container">
        <div className="text-center mb-50px">
          <h2 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-44px text-heading-color font-bold">
            <span className="leading-1.3">Có thể bạn cần </span>
          </h2>
        </div>
        <CarouselPropertyHorizontal packageTypeLevel={"2"} />
      </div>
    </main>
  );
};

export default Homepage;
