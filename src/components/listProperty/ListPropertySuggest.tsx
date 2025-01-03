import { PropPropertyUser } from "@/lib/Interface";
import { pathnames } from "@/lib/pathnames";
import { formayPrice } from "@/lib/utils";
import { Badge } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const ListPropertySuggest: React.FC<PropPropertyUser> = ({ prop }) => {
  const ImageUrl = (dataImage: any): string => {
    let urlImage = dataImage[0].image_url;
    const results = dataImage.filter((item: any) => item.is_main === true);
    if (results.length > 0) {
      urlImage = results[0].image_url;
    }
    return urlImage;
  };
  return (
    <div className="apart-card mb-50px px-15px">
      <div className="group border border-border-color-13 shadow-box-shadow-4">
        <div className=" leading-1">
          {/* <a href="product-details.html" className="overflow-hidden">
            <img
              src="/jpg/frames-for-your-heart-2d4lAQAlbDA-unsplash.jpg"
              className="w-full group-hover:scale-110 transition-all duration-700"
              alt=""
            />
          </a> */}
          <Badge.Ribbon
            className="top-0"
            text={prop.package_type.name}
            color={prop.package_type.color}
          >
            <div className=" leading-1 w-full h-[270px] overflow-hidden">
              <Link
                to={pathnames.publics.Layout + "chi-tiet-tin-dang/" + prop.id}
                className="block w-full h-full"
              >
                <img
                  data-src={ImageUrl(prop.mainImage)}
                  className="w-full h-full  group-hover:scale-110 transition-transform duration-700 lazyload"
                  alt=""
                />
              </Link>
            </div>
          </Badge.Ribbon>
        </div>
        <div className="px-5 pt-30px lg:px-30px">
          <h4 className="text-lg md:text-xl lg:text-22px font-semibold text-heading-color mb-15px">
            <Link
              to={pathnames.publics.Layout + "chi-tiet-tin-dang/" + prop.id}
              className="hover:text-secondary-color line-clamp-1"
            >
              {prop.title}
            </Link>
          </h4>

          <div className="text-sm">
            <a href="locations.html" className="hover:text-secondary-color">
              <i className="fa-solid fa-location-dot text-secondary-color mb-1"></i>
              {prop.district.name}, {prop.province.name}
            </a>
          </div>

          <ul className="flex flex-wrap gap-2 pt-4 pb-5">
            {prop.property_type_id.bathroom && (
              <li>
                <p className="leading-1.8 font-bold text-sm">
                  {prop.bedroom} <span className="font-normal">Phòng ngủ</span>
                </p>
              </li>
            )}
            {prop.property_type_id.bedroom && (
              <li>
                <p className="leading-1.8 font-bold text-sm">
                  {prop.bathroom} <span className="font-normal">Phòng tắm</span>
                </p>
              </li>
            )}
            <li>
              <p className="leading-1.8 font-bold text-sm">
                {prop.square_meter} m<sup>2</sup>{" "}
                <span className="font-normal">Diện tích</span>
              </p>
            </li>
          </ul>
        </div>
        <div className="p-5 lg:px-30px border-t border-border-color-1">
          <h5 className="text-lg text-secondary-color font-semibold mb-5px">
            <span className="leading-1.8">
              {formayPrice(Number(prop.price) || 0)} VNĐ
            </span>
            {prop.property_type_id.listingType === "cho thuê" && (
              <label className="text-sm font-normal">/Tháng</label>
            )}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default ListPropertySuggest;
