"use client";
import React from "react";
import Carousel from "@/components/Carousel";
import { useRouter } from "next/navigation";

function Hero() {
  const router = useRouter();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse w-full">
        {/* 轮播图部分 */}
        <div className="w-full lg:w-2/3">
          <Carousel />
        </div>
        {/* 文字部分 */}
        <div className="w-full lg:w-1/3 lg:pl-8 mt-8 lg:mt-0">
          <h1 className="text-5xl font-bold">耀乘科技出品</h1>
          <p className="py-6 px-4">
            来自耀乘科技的一些小应用 <br />
            免费使用，无需注册，无需登录
            <br />
          </p>
          <div className="flex flex-row flex-wrap gap-6">
            <button
              className="btn btn-primary w-[calc(50%-12px)]"
              onClick={() => {
                router.push("/MBTI/");
              }}
            >
              MBTI 测试
            </button>
            <button
              className="btn btn-primary w-[calc(50%-12px)]"
              onClick={() => {
                router.push("/SDS/");
              }}
            >
              职业兴趣和能力 测试
            </button>
            <button
              className="btn btn-primary w-[calc(50%-12px)]"
              onClick={() => {
                router.push("/pollinations/image");
              }}
            >
              AI 文生图
            </button>
            <button
              className="btn btn-primary w-[calc(50%-12px)]"
              onClick={() => {
                router.push("/Catmeows");
              }}
            >
              喵语
            </button>
            <button
              className="btn btn-primary w-[calc(50%-12px)]"
              onClick={() => {
                router.push("/News");
              }}
            >
              AI推送-AI科技新闻
            </button>
            <button
              className="btn btn-primary w-[calc(50%-12px)]"
              onClick={() => {
                router.push("/PN");
              }}
            >
              AI推送-时政新闻
            </button>
            <button
              className="btn btn-primary w-[calc(50%-12px)]"
              onClick={() => {
                router.push("/HN");
              }}
            >
              AI推送-健康生活新闻
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
