import { banners } from "@/lib/constants";
import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const BannerSlider = () => {
  const intervalRef = useRef<number | null>();
  const [api, setApi] = useState<any>(null);
  const starAutoScroll = () => {
    if (!api) return;
    intervalRef.current = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);
  };
  useEffect(() => {
    if (!api) return;
    starAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api]);
  return (
    <div className="w-full">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {banners.map((el) => (
            <CarouselItem key={el.id}>
              <img
                data-src={el.imageUrl}
                alt=""
                className="w-full aspect-[3/1] object-cover lazyload"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="right-3 w-[50px] h-[50px] rounded-md hover:bg-white/50 bg-transparent" />
        <CarouselPrevious className="left-3 w-[50px] h-[50px] rounded-md hover:bg-white/50  bg-transparent" />
      </Carousel>
    </div>
  );
};

export default BannerSlider;
