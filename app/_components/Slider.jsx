import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const sliderList = [
  {
    name: "Slider 1",
    image: {
      url: "/banner/slider2.webp",
    },
  },
];
function Slider() {
  return (
    <Carousel>
      <CarouselContent>
        {sliderList.map((slider, index) => (
          <CarouselItem key={index}>
            <div className="w-full max-w-screen-xl mx-auto">
              <Image
                src={slider.image.url}
                alt={slider.name}
                width={1920}
                height={1080}
                className="w-full 
      h-[150px] 
      sm:h-[180px] 
      md:h-[200px] 
      lg:h-[200px] 
      xl:h-[220px] 
      2xl:h-[240px] 
      max-h-[240px]
      object-cover 
      object-center
      rounded-xl"
              />
            </div>
          </CarouselItem>
        ))}

        <CarouselItem>...</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default Slider;
