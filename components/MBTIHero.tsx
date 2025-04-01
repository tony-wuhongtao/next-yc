"use client";
import React from "react";
import { useRouter } from "next/navigation";

function Hero() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/MBTI/16types");
  };
  return (
    <div className="hero bg-base-200 min-h-[50vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="/images/hero01.jpg"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">MBTI免费测试</h1>
          <p className="py-6">
            MBTI(Myers-Briggs Type Indicator) 是一种基于瑞士心理学家荣格（Carl
            Jung）心理类型理论的人格测评工具 <br />
            <br /> 由美国心理学家凯瑟琳·布里格斯（Katherine
            Briggs）和伊莎贝尔·迈尔斯（Isabel
            Myers）在20世纪40年代共同开发。它将人格划分为四个维度，每个维度包含两种对立的偏好倾向，共形成16种人格类型。
          </p>
          <button className="btn btn-primary" onClick={handleClick}>
            立刻了解16种人格类型
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
