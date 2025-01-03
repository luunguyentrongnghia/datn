import { apigetProperty } from "@/apis/property";
import ListProperty from "@/components/listProperty/ListProperty";
import React, { useEffect, useState } from "react";
import { Empty, Pagination } from "antd";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { PropertySearch } from "@/components/searchs";
import { prices, sizes, sortProperty } from "@/lib/constants";
import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
const Property = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { idPropertyType, listingType } = useParams();
  const [query, setquery] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "danh-sach-tin-dang",
      { listingType, idPropertyType, searchParams: searchParams.toString() },
      {
        staleTime: 5000,
        cacheTime: 60000,
      },
    ],
    queryFn: async ({ queryKey }) => {
      let query = `listingType=${listingType}`;
      if (idPropertyType) query += `&PropertyTypeId=${idPropertyType}`;
      const response = await apigetProperty(`${query}&${searchParams}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log(response);
      if (response.data.success) {
        setquery((prev) => ({
          ...prev,
          current: response.data.currentPage,
          total: response.data.total,
        }));
        return response.data;
      }
      return [];
    },
  });
  const handleOnChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };
  const itemRender = (current: number, type: string, originalElement: any) => {
    if (type === "prev") {
      return (
        <a className="flex items-center justify-center flex-shrink-0 text-sm lg:text-base  bg-white w-9 h-9 md:w-50px md:h-50px border-2 border-border-color-11 transition-all duration-300 hover:bg-secondary-color hover:text-white hover:border-secondary-color rounded-100% font-bold">
          <i className="fas fa-angle-double-left"></i>
        </a>
      );
    }
    if (type === "next") {
      return (
        <a className="flex items-center justify-center flex-shrink-0 text-sm lg:text-base  bg-white w-9 h-9 md:w-50px md:h-50px border-2 border-border-color-11 transition-all duration-300 hover:bg-secondary-color hover:text-white hover:border-secondary-color rounded-100% font-bold">
          <i className="fas fa-angle-double-right"></i>
        </a>
      );
    }

    return originalElement;
  };
  const sortPropertyUser = (data: any) => {
    const [key, value] = data.split("=");
    const newParams = new URLSearchParams();
    if (data !== "all") {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };
  return (
    <div className="container modal-container tab property-tab py-20">
      <div className="w-full  bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1">
        <div className="container pb-50px">
          <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px">
            <span className="leading-1.3 md:leading-1.3 lg:leading-1.3 xl:leading-1.3">
              Danh sách tin đăng
            </span>
          </h1>
          <ul className="breadcrumb flex gap-30px items-center text-sm lg:text-base font-bold pt-4">
            <li className="home relative leading-1.8 lg:leading-1.8">
              <a href="/">
                <i className="fas fa-home text-secondary-color"></i>Trang chu
              </a>
            </li>
            <li className="leading-1.8 lg:leading-1.8 text-heading-color">
              Danh sach tin dang
            </li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-30px">
        <div className="lg:col-start-1 lg:col-span-8">
          <div className="mb-50px flex flex-col md:flex-row flex-wrap items-start md:items-center gap-y-4">
            <Select
              className="w-[200px]"
              defaultValue={"all"}
              onChange={sortPropertyUser}
            >
              <Select.Option value={"all"}>Mặc định</Select.Option>
              {sortProperty.map((el) => (
                <Select.Option key={el.id} value={el.value}>
                  {el.label}
                </Select.Option>
              ))}
            </Select>
          </div>

          {data ? (
            <>
              <div className="tab-contents">
                {data.data.map((el: any) => {
                  return <ListProperty key={el.id} prop={el} />;
                })}
              </div>

              <div className="flex justify-center mt-4">
                <Pagination
                  total={query.total}
                  pageSize={query.pageSize}
                  current={query.current}
                  itemRender={itemRender}
                  onChange={handleOnChange}
                  showSizeChanger={false}
                  className=" font-bold "
                />
              </div>
            </>
          ) : (
            <Empty description="Không có kết quả nào" />
          )}
        </div>
        <div className="lg:col-start-9 lg:col-span-4 pt-100px lg:pt-0">
          <div>
            <h4 className="mb-10px text-lg md:text-xl lg:text-22px xl:text-2xl text-heading-color font-bold">
              <span className="leading-1.3 md:leading-1.3 xl:leading-1.3">
                Lọc nâng cao
              </span>
            </h4>
            <p className="mb-30px text-[12.25px] lg:text-sm">
              <span className="lg:leading-1 8">
                Hiện có {query.total} bất động sản
              </span>
            </p>
          </div>
          <div className="px-5 pt-35px pb-10 xl:pl-35px xl:pr-30px border-2 border-border-color-11">
            <PropertySearch
              name="price"
              option={prices}
              minValue={0}
              maxValue={10000000000}
              minDefault={Number(searchParams.get("minPrice"))}
              maxDefault={Number(searchParams.get("maxPrice"))}
              label="Mức giá"
            />
            <PropertySearch
              name="size"
              option={sizes}
              minValue={0}
              maxValue={500}
              minDefault={Number(searchParams.get("minSquareMeter"))}
              maxDefault={Number(searchParams.get("maxSquareMeter"))}
              label="Diện tích"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
