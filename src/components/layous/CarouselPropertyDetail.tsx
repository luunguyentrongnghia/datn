import { apigetProperty } from "@/apis/property";
import { Listing } from "@/lib/Interface";
import { pathnames } from "@/lib/pathnames";
import { formayPrice, generateDefaultAvatar } from "@/lib/utils";
import { Badge, Carousel } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
const CarouselPropertyDetail = () => {
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
    const response = await apigetProperty(
      "items_per_page=3&LevelPackageType=3"
    );

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
          Nổi bật
        </span>
      </h4>

      <div className="news-slider-container swiper-container relative -mx-15px">
        <div className="swiper popular-properties-slider static">
          <Carousel autoplay>
            {Property.map((el, index) => (
              <div style={contentStyle}>
                <div className="swiper-wrapper">
                  <div className="swiper-slide mb-50px cursor-default">
                    <div className="apart-card px-15px">
                      <div className="group border border-border-color-13 shadow-box-shadow-4">
                        <div className="relative leading-1">
                          <Badge.Ribbon
                            className="top-0"
                            text={el?.package_type.name}
                            color={el?.package_type.color}
                          >
                            <Link
                              to={
                                pathnames.publics.Layout +
                                "chi-tiet-tin-dang/" +
                                el.id
                              }
                              className="overflow-hidden"
                            >
                              <img
                                src={ImageUrl(el.mainImage)}
                                alt=""
                                className="w-[350px] h-[250px] group-hover:scale-110 transition-all duration-700"
                              />
                            </Link>
                          </Badge.Ribbon>

                          <div className="absolute top-10 lg:top-5 right-[30px]">
                            <p className="w-50px h-50px">
                              <Image
                                fallbackSrc={generateDefaultAvatar(
                                  el.idUser.fullname
                                )}
                                src={el.idUser.avatar}
                                className="w-full h-full rounded-100% group-hover:scale-110 border-3px border-border-color-1 transition-all duration-300"
                              />
                            </p>
                          </div>
                        </div>
                        <div className="p-25px">
                          <h5 className="text-lg text-secondary-color font-semibold mb-5px">
                            <span className="leading-1.8">
                              {formayPrice(Number(el.price) || 0)} VNĐ
                            </span>
                            {el.property_type_id.listingType === "cho thuê" && (
                              <label className="text-sm font-normal">
                                /Tháng
                              </label>
                            )}
                          </h5>
                          <h4 className="text-base font-semibold text-heading-color mb-15px">
                            <Link
                              to={
                                pathnames.publics.Layout +
                                "chi-tiet-tin-dang/" +
                                el.id
                              }
                              className="hover:text-secondary-color line-clamp-1"
                            >
                              {el.title}
                            </Link>
                          </h4>

                          <div className="text-xs">
                            <p className="hover:text-secondary-color">
                              <i className="fa-solid fa-location-dot text-secondary-color"></i>{" "}
                              {el?.district.name},{el?.province.name}
                            </p>
                          </div>

                          <ul className="flex flex-wrap gap-15px pt-4">
                            {el?.property_type_id.bathroom && (
                              <li>
                                <p className="leading-1.8 font-bold text-sm">
                                  {el.bedroom}{" "}
                                  <span className="font-normal">Phòng ngủ</span>
                                </p>
                              </li>
                            )}
                            {el?.property_type_id.bedroom && (
                              <li>
                                <p className="leading-1.8 font-bold text-sm">
                                  {el.bathroom}{" "}
                                  <span className="font-normal">Phòng tắm</span>
                                </p>
                              </li>
                            )}
                            <li>
                              <p className="leading-1.8 font-bold text-sm">
                                {el?.square_meter} m<sup>2</sup>{" "}
                                <span className="font-normal">Diện tích</span>
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default CarouselPropertyDetail;
