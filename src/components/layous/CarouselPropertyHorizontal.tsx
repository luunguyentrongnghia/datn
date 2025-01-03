import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ListPropertyDetail from "../listProperty/ListPropertyDetail";
import { apigetProperty } from "@/apis/property";
interface propCarouselProperty {
  PropertyTypeId?: string;
  excludeIds?: string;
  packageTypeLevel?: string;
}
const CarouselPropertyHorizontal: React.FC<propCarouselProperty> = ({
  PropertyTypeId,
  excludeIds,
  packageTypeLevel,
}) => {
  const [property, setProperty] = useState([]);
  const getProperty = async () => {
    const response = await apigetProperty(
      `province=${PropertyTypeId || ""}&excludeIds=${
        excludeIds || ""
      }&LevelPackageType=${packageTypeLevel || ""}`
    );
    setProperty(response.data.data);
  };
  useEffect(() => {
    getProperty();
  }, []);
  return (
    <div className="w-full flex justify-center">
      <Carousel className="w-[100%]">
        <CarouselContent className="-ml-1">
          {property.map((el, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <ListPropertyDetail Property={el} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="right-3 w-[50px] h-[50px] rounded-md text-black hover:bg-orange-300 hover:text-white " />
        <CarouselPrevious className="left-3 w-[50px] h-[50px] rounded-md text-black hover:bg-orange-300 hover:text-white  " />
      </Carousel>
    </div>
  );
};

export default CarouselPropertyHorizontal;
