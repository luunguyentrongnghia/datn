import { apigetProperty } from "@/apis/property";
import { Listing } from "@/lib/Interface";
import { pathnames } from "@/lib/pathnames";
import { formayPrice } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ListNewPropertyDetail = () => {
  const [Property, setProperty] = useState<Listing[]>([]);
  const ImageUrl = (dataImage: any): string => {
    let urlImage = dataImage[0].image_url;
    const results = dataImage.filter((item: any) => item.is_main === true);
    if (results.length > 0) {
      urlImage = results[0].image_url;
    }
    return urlImage;
  };
  const getProperty = async () => {
    const response = await apigetProperty("items_per_page=3");

    if (response.data.success) {
      setProperty(response.data.data);
    }
  };
  useEffect(() => {
    getProperty();
  }, []);
  return (
    <div className="px-5 pt-35px pb-10 xl:pl-35px xl:pr-30px mb-10 border-2 border-border-color-11">
      <h4 className="text-lg font-semibold text-heading-color mb-25px">
        <span className="leading-1.3 pl-10px border-l-2 border-secondary-color">
          Mới Nhất
        </span>
      </h4>
      <ul>
        {Property.map((el, index) => (
          <li key={index} className="pb-25px mb-25px border-b border-white-4">
            <div className="flex gap-x-15px xl:gap-x-5">
              <div className="w-70px xl:w-90px flex-shrink-0">
                <Link
                  to={pathnames.publics.Layout + "chi-tiet-tin-dang/" + el.id}
                >
                  <img
                    data-src={ImageUrl(el.mainImage)}
                    alt=""
                    className="w-32 h-16 lazyload"
                  />
                </Link>
              </div>

              <div>
                <h6 className="text-sm font-medium mb-1">
                  <Link
                    to={pathnames.publics.Layout + "chi-tiet-tin-dang/" + el.id}
                    className="line-clamp-1"
                  >
                    {el.title}
                  </Link>
                </h6>
                <p className="text-sm font-bold text-secondary-color">
                  <span className="leading-1.8">
                    {formayPrice(Number(el.price) || 0)} VNĐ
                  </span>
                  {el.property_type_id.listingType === "cho thuê" && (
                    <label className="text-sm font-normal">/Tháng</label>
                  )}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListNewPropertyDetail;
