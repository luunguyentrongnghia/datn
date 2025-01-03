import useAppStore from "@/zustand/useAppStore";
import clsx from "clsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ImageDetail from "./ImageDetail";
interface imageProperty {
  id: string;
  image_url: string;
  is_main: boolean;
  caption: string | null;
}
interface PropSlider {
  mainImage: imageProperty[];
}
const BannerSliderDetail: React.FC<PropSlider> = ({ mainImage }) => {
  const { setModal } = useAppStore();
  const handleNavigateToDetailImage = (index: number) => {
    setModal(true, <ImageDetail mainImage={mainImage} forceIndex={index} />);
  };
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
        slidesToScroll: 1,
      }}
      className=" swiper-container relative h-[400px]"
    >
      <CarouselContent>
        {mainImage.map((item, index) => (
          <CarouselItem
            key={item.id}
            className={clsx(
              mainImage.length >= 3
                ? "lg:basis-3/5 md:basis-1/2"
                : "w-full object-cove"
            )}
          >
            <div
              className=" cursor-pointer"
              onClick={(e) => {
                handleNavigateToDetailImage(index);
              }}
            >
              <img
                className="hover:scale-110 transition-all duration-700 w-full h-[400px] object-cover"
                src={item.image_url}
                alt=""
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="right-3 w-[50px] h-[50px] rounded-md hover:bg-white/50 bg-transparent" />
      <CarouselPrevious className="left-3 w-[50px] h-[50px] rounded-md hover:bg-white/50  bg-transparent" />
    </Carousel>
  );
};

export default BannerSliderDetail;
