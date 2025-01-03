import React from "react";
import { Listing } from "@/lib/Interface";
import moment from "moment";
import { Link } from "react-router-dom";
import { pathnames } from "@/lib/pathnames";
import { formayPrice } from "@/lib/utils";
import { Badge } from "antd";
interface propProperty {
  Property?: Listing;
}
const ListPropertyDetail: React.FC<propProperty> = ({ Property }) => {
  const ImageUrl = (dataImage: any): string => {
    let urlImage = dataImage[0].image_url;
    const results = dataImage.filter((item: any) => item.is_main === true);
    if (results.length > 0) {
      urlImage = results[0].image_url;
    }
    return urlImage;
  };
  return (
    <div className="group">
      <div className="relative leading-1">
        <Badge.Ribbon
          className="top-0"
          text={Property?.package_type.name}
          color={Property?.package_type.color}
        >
          <Link
            to={pathnames.publics.Layout + "chi-tiet-tin-dang/" + Property?.id}
            className="overflow-hidden w-full h-64"
          >
            <img
              data-src={ImageUrl(Property?.mainImage)}
              className="w-full h-full group-hover:scale-110 transition-all duration-700 lazyload"
              alt=""
            />
          </Link>
        </Badge.Ribbon>
      </div>
      <div className="p-30px shadow-box-shadow-4">
        <h4 className="text-lg md:text-xl lg:text-22px font-semibold text-heading-color">
          <Link
            to={pathnames.publics.Layout + "chi-tiet-tin-dang/" + Property?.id}
            className="hover:text-secondary-color line-clamp-1"
          >
            {Property?.title}
          </Link>
        </h4>
        <span className="text-[13px] mt-3">
          <i className="fa-solid fa-location-dot text-secondary-color"></i>{" "}
          {Property?.district.name},{Property?.province.name}
        </span>
        <ul className="flex flex-wrap gap-2 pt-4 pb-5">
          {Property?.property_type_id.bathroom && (
            <li>
              <p className="leading-1.8 font-bold text-sm">
                {Property.bedroom}{" "}
                <span className="font-normal">Phòng ngủ</span>
              </p>
            </li>
          )}
          {Property?.property_type_id.bedroom && (
            <li>
              <p className="leading-1.8 font-bold text-sm">
                {Property.bathroom}{" "}
                <span className="font-normal">Phòng tắm</span>
              </p>
            </li>
          )}
          <li>
            <p className="leading-1.8 font-bold text-sm">
              {Property?.square_meter} m<sup>2</sup>{" "}
              <span className="font-normal">Diện tích</span>
            </p>
          </li>
        </ul>
        <div className="pt-5 mt-5 lg:pt-5 border-t border-border-color-1">
          <ul className="flex justify-between items-center">
            <li className="text-xs md:text-sm font-semibold">
              <p className="leading-1.8 flex gap-5px items-center">
                <i className="far fa-calendar-alt text-secondary-color"></i>
                {moment(Property?.start_date).format("DD/MM/YYYY")}
              </p>
            </li>
            <li className="text-xs md:text-sm font-semibold">
              <h5 className="text-lg text-secondary-color font-semibold mb-5px">
                <span className="leading-1.8">
                  {formayPrice(Number(Property?.price) || 0)} VNĐ
                </span>
                {Property?.property_type_id.listingType === "cho thuê" && (
                  <label className="text-sm font-normal">/Tháng</label>
                )}
              </h5>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListPropertyDetail;
