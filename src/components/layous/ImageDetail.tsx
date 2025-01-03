import useAppStore from "@/zustand/useAppStore";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
interface imageProperty {
  id: string;
  image_url: string;
  is_main: boolean;
  caption: string | null;
}
interface PropSlider {
  mainImage: imageProperty[];
  forceIndex: number;
}
const ImageDetail: React.FC<PropSlider> = ({ mainImage, forceIndex = 0 }) => {
  const { setModal } = useAppStore();
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-black bg-opacity-90 w-screen h-screen"
    >
      <div className="flex items-center justify-between">
        <span
          className="p-2 cursor-pointer"
          onClick={() => setModal(false, null)}
        >
          <div className="flex px-6 py-2 items-center justify-between">
            <span
              className=" cursor-pointer"
              onClick={() => setModal(false, null)}
            >
              <i className="fa-solid fa-xmark text-white text-[30px]"></i>
            </span>
          </div>
        </span>
      </div>
      <Carousel
        opts={{
          //   align: "center",
          slidesToScroll: 1,
          startIndex: forceIndex,
        }}
      >
        <CarouselContent className="flex items-center">
          {mainImage.map((item, index) => (
            <CarouselItem key={item.id} className={"w-full object-cover"}>
              <div>
                <img
                  className="max-w-[500px] object-contain mx-auto"
                  src={item.image_url}
                  alt=""
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="right-10 w-[50px] h-[50px] rounded-md hover:bg-white/50 bg-transparent" />
        <CarouselPrevious className="left-10 w-[50px] h-[50px] rounded-md hover:bg-white/50  bg-transparent" />
      </Carousel>
    </div>
  );
};

export default ImageDetail;
