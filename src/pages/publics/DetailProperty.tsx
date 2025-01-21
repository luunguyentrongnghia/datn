import { apigetPropertyDetail } from "@/apis/property";
import BannerSliderDetail from "@/components/layous/BannerSliderDetail";
import { Listing } from "@/lib/Interface";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { formayPrice } from "@/lib/utils";
import InforUser from "@/components/detailPropertyUser/InforUser";
import Map from "@/components/detailPropertyUser/Map";
import { Modal } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TextArea from "antd/es/input/TextArea";
import { FormInput } from "@/components/forms";
import useMeStore from "@/zustand/useMeStore";
import { apicreateInquiries } from "@/apis/Inquiries";
import { toast } from "sonner";
import CarouselPropertyHorizontal from "@/components/layous/CarouselPropertyHorizontal";
import ListNewPropertyDetail from "@/components/listProperty/ListNewPropertyDetail";
import CarouselPropertyDetail from "@/components/layous/CarouselPropertyDetail";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apicreateReportProperty } from "@/apis/ReportProperty";
const form2Schema = () =>
  z.object({
    reason: z.string().min(1, { message: "trường này là bắt buộc." }),
  });
const DetailProperty = () => {
  const { idProperty } = useParams();
  const [property, setProperty] = useState<Listing>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const { me } = useMeStore();
  const form = useForm({
    defaultValues: {
      infor: "",
      message: `Tôi có quan tâm tới tin đăng này: "${window.location.href}" hảy liên hệ lại với tôi`,
    },
  });
  const form2 = useForm({
    resolver: zodResolver(form2Schema()),
    defaultValues: {
      reason: "",
    },
  });
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    async function fetchProperty() {
      if (idProperty) {
        const response = await apigetPropertyDetail(idProperty);
        if (response.data.success) {
          setProperty(response.data.data);
          let addressLocal = localStorage.getItem("addressHistory");
          if (addressLocal) {
            let address = JSON.parse(addressLocal);
            if (
              Number(address.provinceId) !==
                Number(response.data.data.province.id) &&
              Number(address.districtId) !==
                Number(response.data.data.district.id)
            ) {
              if (address.count > 0) {
                localStorage.setItem(
                  "addressHistory",
                  JSON.stringify({
                    provinceId: response.data.data.province.id,
                    districtId: response.data.data.district.id,
                    count: 0,
                  })
                );
              } else {
                localStorage.setItem(
                  "addressHistory",
                  JSON.stringify({
                    ...address,
                    count: 1,
                  })
                );
              }
            }
          }
        }
      }
    }
    fetchProperty();
  }, [idProperty]);
  useEffect(() => {
    form.setValue("infor", me?.email);
  }, [me]);
  const handleInquiries = async (data: any) => {
    data.url = `${window.location.href}`;
    data.propertyId = property?.id;
    data.sellerUser = property?.idUser.id;
    const createInquiries = await apicreateInquiries(data);
    if (createInquiries.data.success) {
      toast.success(createInquiries.data.msg);
      setIsModalOpen(false);
    } else {
      toast.error(createInquiries.data.msg);
    }
  };
  const handleFormReportProperty = () => {
    if (me.status === "lock") {
      toast.error("Hiện không thể dùng được chức năng này");
    } else {
      setIsModalOpen2(true);
    }
  };
  const handleReportProperty = async (data: any) => {
    data.url = window.location.href;
    data.post = property?.id;
    const report = await apicreateReportProperty(data);
    if (report.data.success) {
      toast.success(report.data.msg);
      setIsModalOpen2(false);
    } else {
      toast.error(report.data.msg);
    }
  };
  return (
    <div>
      <section>
        <div className="w-full bg-[url('../img/bg/14.html')] bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1">
          <div className="container py-50px">
            <ul className="breadcrumb flex gap-30px items-center text-sm lg:text-base font-bold pt-4">
              <li className="home relative leading-1.8 lg:leading-1.8">
                <a href="/">
                  <i className="fas fa-home text-secondary-color"></i> Home
                </a>
              </li>
              <li className="leading-1.8 lg:leading-1.8 text-heading-color">
                chi tiết tin đăng
              </li>
            </ul>
          </div>
        </div>
      </section>
      {property && <BannerSliderDetail mainImage={property.mainImage} />}
      <div className="container modal-container property-tab pt-70px ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-30px">
          <div className="lg:col-start-1 lg:col-span-8">
            <ul className="flex flex-wrap gap-x-15px md:gap-x-35px gap-y-15px items-center mb-30px">
              <li>
                <div className="flex gap-x-15px md:gap-x-30px items-center">
                  <p className="text-xs md:text-sm font-semibold">
                    <span className="leading-1.8 md:leading-1.8">
                      <i className="far fa-calendar-alt text-secondary-color mr-5px"></i>
                      {moment(property?.start_date).format("DD/MM/YYYY")}
                    </span>
                  </p>
                </div>
              </li>
              <li>
                <Button
                  className="bg-red-500"
                  variant={"button1"}
                  onClick={handleFormReportProperty}
                >
                  Báo cáo
                </Button>
              </li>
            </ul>
            <div>
              <h4 className="text-2xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px">
                <span className="leading-1.3 lg:leading-1.3 xl:leading-1.3">
                  {property?.title}
                </span>
              </h4>
              <p className="text-sm">
                <span className="leading-1.8">
                  <i className="flaticon-pin text-secondary-color"></i>
                  {property?.address}, {property?.ward.name},
                  {property?.district.name}, {property?.province.name}
                </span>
              </p>
              <div className="flex gap-20 mt-10 bg-section-bg-1 p-4">
                <div className="flex flex-col gap-3">
                  <span className="font-normal text-[18px] text-gray-500">
                    Mức giá
                  </span>
                  <span className="font-bold text-[20px] text-black">
                    {formayPrice(Number(property?.price))} VNĐ
                    {property?.property_type_id.listingType === "cho thuê" &&
                      "/Tháng"}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="font-normal text-[18px] text-gray-500">
                    Diện tích
                  </span>
                  <span className="font-bold text-[20px] text-black">
                    {property?.square_meter} m<sup>2</sup>
                  </span>
                </div>
                {property?.property_type_id.bedroom && (
                  <div className="flex flex-col gap-3">
                    <span className="font-normal text-[18px] text-gray-500">
                      Phòng ngủ
                    </span>
                    <span className="font-bold text-[20px] text-black">
                      {property?.bedroom} PN
                    </span>
                  </div>
                )}
                {property?.property_type_id.listingType === "cho thuê" && (
                  <div className="flex flex-col gap-3">
                    <span className="font-normal text-[18px] text-gray-500">
                      Tiền cọc
                    </span>
                    <span className="font-bold text-[20px] text-black">
                      {property?.Deposit_amount}
                    </span>
                  </div>
                )}
              </div>
              <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px">
                Mô tả
              </h4>
              {property?.description && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(property?.description),
                  }}
                />
              )}
              <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px">
                Đặc điểm bất động sản
              </h4>

              <ul className="grid grid-cols-4 mb-45px">
                {property?.property_type_id.bedroom && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-bed text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3"> Phòng ngủ</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.bedroom} PN
                        </span>
                      </p>
                    </div>
                  </li>
                )}
                {property?.property_type_id.bathroom && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-bath text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3"> Phòng tắm</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.bathroom} PT
                        </span>
                      </p>
                    </div>
                  </li>
                )}
                {property?.property_type_id.isFurniture && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-couch text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3"> Nội thất</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.isFurniture}
                        </span>
                      </p>
                    </div>
                  </li>
                )}
                {property?.property_type_id.floor && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-stairs text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3"> Số tầng</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.floor}
                        </span>
                      </p>
                    </div>
                  </li>
                )}
                {property?.property_type_id.direction && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-compass text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3"> Hướng</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.direction}
                        </span>
                      </p>
                    </div>
                  </li>
                )}
                {property?.property_type_id.balonDirection && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-brands fa-windows text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3">Hướng ban công</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.balonDirection}
                        </span>
                      </p>
                    </div>
                  </li>
                )}
                {property?.property_type_id.Road && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-road text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3"> Đường</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">{property?.Road}</span>
                      </p>
                    </div>
                  </li>
                )}

                {property?.property_type_id.Legal && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-gavel text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3">Pháp lý</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.Legal}
                        </span>
                      </p>
                    </div>
                  </li>
                )}

                {property?.property_type_id.Land_status && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-brands fa-sourcetree text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3">Tình trạng đất</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.Land_status}
                        </span>
                      </p>
                    </div>
                  </li>
                )}
                {property?.property_type_id.Horizontal && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-left-right  text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3">Chiều ngang</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.Horizontal}m
                        </span>
                      </p>
                    </div>
                  </li>
                )}
                {property?.property_type_id.Length && (
                  <li className="text-sm pt-4 pb-10px pr-6 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-section-bg-5">
                      <i className="fa-solid fa-ruler text-22px text-secondary-color"></i>
                    </div>
                    <div>
                      <h6 className="text-sm text-heading-color font-normal mb-0.5">
                        <span className="leading-1.3">Chiều dài</span>
                      </h6>
                      <p className="text-[12.25px] lg:text-sm">
                        <span className="lg:leading-1.8">
                          {property?.Length}m
                        </span>
                      </p>
                    </div>
                  </li>
                )}
              </ul>
              <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px">
                Vị trí
              </h4>
              <div className="h-360px  mb-60px">
                {property?.district.name && property.province.name && (
                  <Map
                    address={`${property.ward.name},${property?.district.name},${property?.province.name}`}
                  />
                )}
              </div>
              <div className="px-10 py-5 bg-section-bg-1 grid grid-cols-1 lg:grid-cols-2 gap-x-30px gap-y-10px mt-50px">
                <div>
                  <div className="flex flex-col gap-y-10px items-stretch">
                    <ul className="flex justify-between items-center">
                      <li className="leading-1.8 pr-10px bg-section-bg-1">
                        Ngày Đăng:
                      </li>

                      <li className="text-sm lg:text-base leading-1.8 pl-10px bg-section-bg-1">
                        {moment(property?.start_date).format("DD/MM/YYYY")}
                      </li>
                    </ul>

                    <ul className="flex justify-between items-center">
                      <li className="leading-1.8 pr-10px bg-section-bg-1">
                        Ngày kết thúc:
                      </li>

                      <li className="text-sm lg:text-base leading-1.8 pl-10px bg-section-bg-1">
                        {moment(property?.end_date).format("DD/MM/YYYY")}
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col gap-y-10px items-stretch">
                    <ul className="flex justify-between items-center">
                      <li className="leading-1.8 pr-10px bg-section-bg-1">
                        Gói tin:
                      </li>

                      <li className="text-sm lg:text-base leading-1.8 pl-10px bg-section-bg-1">
                        {property?.package_type.name}
                      </li>
                    </ul>

                    <ul className="flex justify-between items-center">
                      <li className="leading-1.8 pr-10px bg-section-bg-1">
                        Loại tin:
                      </li>

                      <li className="text-sm lg:text-base leading-1.8 pl-10px bg-section-bg-1">
                        {property?.property_type_id.name}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-start-9 lg:col-span-4 pt-60px lg:pt-0">
            {property && (
              <InforUser
                user={property?.idUser}
                setIsModalOpen={setIsModalOpen}
              />
            )}
            <ListNewPropertyDetail />
            <CarouselPropertyDetail />
          </div>
        </div>
      </div>
      <div className="container">
        <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px">
          Có thể bạn cần
        </h4>
        <CarouselPropertyHorizontal
          PropertyTypeId={property?.property_type_id.id}
          excludeIds={idProperty}
        />
      </div>
      {me && (
        <Modal
          title="Liên hệ"
          mask={false}
          style={{
            top: 200,
          }}
          width={500}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          onClose={() => {
            setIsModalOpen(false);
          }}
          footer={null}
        >
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleInquiries)}>
              <FormInput
                type="text"
                form={form}
                name="infor"
                label="Liên hệ qua"
              />
              <FormField
                name={"message"}
                control={form.control}
                render={({ field }: { field: any }) => {
                  return (
                    <FormItem className="mb-4">
                      <FormLabel>Lời nhắn:</FormLabel>
                      <FormControl>
                        <TextArea rows={4} {...field} />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <div className="flex justify-end mt-5">
                <Button
                  variant={"button1"}
                  type="submit"
                  className={"bg-red-500"}
                >
                  Gửi
                </Button>
              </div>
            </form>
          </FormProvider>
        </Modal>
      )}
      {me && (
        <Modal
          title="Báo cáo vi phạm"
          mask={false}
          style={{
            top: 200,
          }}
          width={500}
          open={isModalOpen2}
          onCancel={() => {
            setIsModalOpen2(false);
          }}
          onClose={() => {
            setIsModalOpen2(false);
          }}
          footer={null}
        >
          <FormProvider {...form2}>
            <form onSubmit={form2.handleSubmit(handleReportProperty)}>
              <FormField
                name={"reason"}
                control={form2.control}
                render={({ field }: { field: any }) => {
                  return (
                    <FormItem className="mb-4">
                      <FormLabel className="text-black">Lý do:</FormLabel>
                      <FormControl>
                        <TextArea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex justify-end mt-5">
                <Button
                  variant={"button1"}
                  type="submit"
                  className={"bg-red-500"}
                >
                  Gửi
                </Button>
              </div>
            </form>
          </FormProvider>
        </Modal>
      )}
    </div>
  );
};

export default DetailProperty;
