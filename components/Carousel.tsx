"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const carouselImgSrc = [
  "/images/home_hero01.jpg",
  "/images/home_hero02.jpg",
  "/images/home_hero03.jpg",
  "/images/home_hero04.jpg",
  "/images/home_hero05.jpg",
  "/images/home_hero06.jpg",
];

export default function Carousel() {
  const [carouselActiveItem, setCarouselActiveItem] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 获取容器宽度
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const scrollItem = () => {
    setCarouselActiveItem((prevState) => {
      if (carouselImgSrc.length - 1 > prevState) {
        return prevState + 1;
      } else {
        return 0;
      }
    });
  };

  const autoplay = useCallback(() => setInterval(scrollItem, 2000), []);

  useEffect(() => {
    const play = autoplay();
    return () => clearInterval(play);
  }, [autoplay]);

  useEffect(() => {
    carouselRef.current?.scroll({
      left: containerWidth * carouselActiveItem,
      behavior: "smooth",
    });
  }, [carouselActiveItem, containerWidth]);

  return (
    <div
      ref={carouselRef}
      className="carousel carousel-center rounded-4xl shadow-2xl w-full overflow-hidden"
      style={{ height: "500px" }}
    >
      {carouselImgSrc.map((imgSrc) => (
        <div
          key={imgSrc}
          className="carousel-item w-full relative"
          style={{
            minWidth: "100%", // 改为100%宽度
            width: "100%", // 添加宽度
            height: "100%",
            scrollSnapAlign: "start", // 添加对齐方式
          }}
        >
          <Image
            src={imgSrc}
            alt={imgSrc}
            fill
            className="object-cover"
            priority
          />
        </div>
      ))}
    </div>
  );
}
