import { PropPropertyUser } from "@/lib/Interface";
import React from "react";
import Image from "../layous/Image";
import { formayPrice, generateDefaultAvatar } from "@/lib/utils";
import { Badge } from "antd";
import { Link } from "react-router-dom";
import { pathnames } from "@/lib/pathnames";
import DOMPurify from "dompurify";
import moment from "moment";
import { Button } from "../ui/button";
import { toast } from "sonner";
import useMeStore from "@/zustand/useMeStore";
const ListProperty: React.FC<PropPropertyUser> = ({ prop }) => {
  const ImageUrl = (dataImage: any): string => {
    let urlImage = dataImage[0].image_url;
    const results = dataImage.filter((item: any) => item.is_main === true);
    if (results.length > 0) {
      urlImage = results[0].image_url;
    }
    return urlImage;
  };
  const { me } = useMeStore();
  const handleGetEmail = (email: string) => {
    if (me && me.email && me.status !== "lock") {
      navigator.clipboard.writeText(email).then(() => {
        toast.success("Sao chép thành công");
        const subject = "Quan tâm đến tin đăng";
        const body = `Tôi có quan tâm tới tin đăng này: "${window.location.href}"`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
      });
    } else {
      toast.error("Hiện không thể dùng được chức năng này");
    }
  };
  return (
    <div className="mb-50px">
      <div className="group border border-border-color-13 shadow-box-shadow-4 p-30px md:pb-22px  ">
        <div className="flex flex-wrap">
          <div className="w-[40%] ">
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
          <div className=" w-[60%]  pt-25px md:pt-0">
            <div className="flex flex-col pl-0 md:pl-30px ml-3">
              <div className="flex justify-end items-center gap-x-15px">
                <h5 className="text-lg text-secondary-color font-semibold">
                  <span className="leading-1.8">
                    {formayPrice(Number(prop.price) || 0)} VNĐ
                  </span>
                  {prop.property_type_id.listingType === "cho thuê" && (
                    <label className="text-sm font-normal">/Tháng</label>
                  )}
                </h5>
              </div>
              <h4 className="text-lg lg:text-22px font-semibold text-heading-color mb-[3px]">
                <Link
                  to={pathnames.publics.Layout + "chi-tiet-tin-dang/" + prop.id}
                  className="hover:text-secondary-color line-clamp-2"
                >
                  {prop.title}
                </Link>
              </h4>

              <div className="text-sm">
                <a href="locations.html" className="hover:text-secondary-color">
                  <i className="fa-solid fa-location-dot text-secondary-color mb-1"></i>
                  {prop.ward.name} ,{prop.district.name}, {prop.province.name}
                </a>
              </div>

              {prop.package_type.isShowDetails && (
                <ul className="flex flex-wrap gap-2  ">
                  {prop.property_type_id.bathroom && (
                    <li>
                      <p className="leading-1.8 font-bold text-sm">
                        {prop.bedroom}{" "}
                        <span className="font-normal">Phòng ngủ</span>
                      </p>
                    </li>
                  )}
                  {prop.property_type_id.bedroom && (
                    <li>
                      <p className="leading-1.8 font-bold text-sm">
                        {prop.bathroom}{" "}
                        <span className="font-normal">Phòng tắm</span>
                      </p>
                    </li>
                  )}
                  {prop.property_type_id.Horizontal && (
                    <li>
                      <p className="leading-1.8 font-bold text-sm">
                        {prop.Horizontal}m{" "}
                        <span className="font-normal">Chiều ngang</span>
                      </p>
                    </li>
                  )}
                  {prop.property_type_id.Length && (
                    <li>
                      <p className="leading-1.8 font-bold text-sm">
                        {prop.Length}m{" "}
                        <span className="font-normal">Chiều dài</span>
                      </p>
                    </li>
                  )}
                  <li>
                    <p className="leading-1.8 font-bold text-sm">
                      {prop.square_meter}{" "}
                      <span className="font-normal">Diện tích</span>
                    </p>
                  </li>
                </ul>
              )}
              {prop.package_type.isShowDecription && (
                <div
                  className="leading-3 font-bold text-lg line-clamp-2 pt-1"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(prop?.description || ""),
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {prop.package_type.isShowContactInfo && (
          <div className="flex justify-between items-center flex-wrap-reverse gap-y-15px mt-3">
            <div className="flex items-center gap-15px">
              <div>
                <a href="team-details.html" className="w-[40px] h-[40px]">
                  <Image
                    fallbackSrc={generateDefaultAvatar(prop.idUser.fullname)}
                    src={prop.idUser.avatar}
                    className="w-full h-full rounded-100% border-3px border-border-color-1 transition-all duration-300"
                  />
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold ">
                  <a href="team-details.html" className="leading-1.3">
                    {prop.idUser.fullname}
                  </a>
                </h3>
                <p className="text-[12px]">
                  {moment(prop?.start_date).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
            <div>
              <Button
                variant={"button1"}
                onClick={() => handleGetEmail(prop.idUser.email)}
                className="bg-orange-500 mb-3"
              >
                Liên hệ qua mail
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProperty;
