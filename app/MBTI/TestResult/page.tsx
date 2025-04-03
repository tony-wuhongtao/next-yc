"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type PersonalityType = {
  type: string;
  name: string;
  description: string;
  color: string;
  image: string;
};

function MBTIResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [personalityType, setPersonalityType] =
    useState<PersonalityType | null>(null);

  // 从URL参数中获取分数并计算百分比
  const getPercentage = (left: number, right: number) => {
    const total = left + right;
    return {
      leftValue: Math.round((left / total) * 100),
      rightValue: Math.round((right / total) * 100),
    };
  };

  const testData = {
    type: searchParams.get("type"),
    image: `/images/character-imgs/${searchParams
      .get("type")
      ?.toUpperCase()}.png`,
    dimensions: [
      {
        left: "I（内向）",
        right: "E（外向）",
        ...getPercentage(
          Number(searchParams.get("I")),
          Number(searchParams.get("E"))
        ),
      },
      {
        left: "S（实感）",
        right: "N（直觉）",
        ...getPercentage(
          Number(searchParams.get("S")),
          Number(searchParams.get("N"))
        ),
      },
      {
        left: "T（思考）",
        right: "F（情感）",
        ...getPercentage(
          Number(searchParams.get("T")),
          Number(searchParams.get("F"))
        ),
      },
      {
        left: "J（判断）",
        right: "P（知觉）",
        ...getPercentage(
          Number(searchParams.get("J")),
          Number(searchParams.get("P"))
        ),
      },
    ],
    description: personalityType?.description || (
      <div className="text-left text-gray-800 text-lg whitespace-pre-line">
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    ),
  };

  // 获取人格类型描述
  useEffect(() => {
    const fetchPersonalityType = async () => {
      const response = await fetch(`/api/personality-des`);
      const data = await response.json();
      const type = testData.type ? data[testData.type] : "";

      setPersonalityType({
        type: testData.type || "",
        name: testData.type || "", // 添加默认名称
        description: type || "未找到对应的性格描述",
        color: "#000000", // 添加默认颜色
        image: `/images/character-imgs/${testData.type?.toUpperCase()}.png`, // 添加图片路径
      });
    };

    fetchPersonalityType();
  }, [testData.type]);

  const handleDeepseekAnalysis = () => {
    const params = new URLSearchParams({
      I: searchParams.get("I") || "0",
      E: searchParams.get("E") || "0",
      S: searchParams.get("S") || "0",
      N: searchParams.get("N") || "0",
      T: searchParams.get("T") || "0",
      F: searchParams.get("F") || "0",
      J: searchParams.get("J") || "0",
      P: searchParams.get("P") || "0",
    });
    router.push(`/llm?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body space-y-8">
          {/* 顶部图片和类型标识 */}
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">
              {testData.type}
            </h1>
            <div className="w-auto rounded-4xl shadow-lg">
              <img src={testData.image} alt="MBTI类型形象" />
            </div>
          </div>

          {/* 数据图表部分 */}
          <div className="space-y-8">
            {testData.dimensions.map((dimension, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-800">{dimension.left}</span>
                  <span className="text-gray-800">{dimension.right}</span>
                </div>

                {/* 进度条容器 */}
                <div className="relative h-4 rounded-full bg-base-200">
                  {/* 左侧进度条 */}
                  <div
                    className="absolute left-0 h-full bg-orange-300 rounded-l-full"
                    style={{ width: `${dimension.leftValue}%` }}
                  />
                  {/* 右侧进度条 */}
                  <div
                    className="absolute right-0 h-full bg-indigo-300 rounded-r-full"
                    style={{ width: `${dimension.rightValue}%` }}
                  />
                </div>

                {/* 数值标签 */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-800">{dimension.leftValue}%</span>
                  <span className="text-gray-800">{dimension.rightValue}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* 描述部分 */}
          <div className="bg-blue-200/20 p-4 rounded-box">
            <div className="text-left text-gray-800 text-lg whitespace-pre-line">
              {testData.description}
              {personalityType && (
                <button
                  onClick={handleDeepseekAnalysis}
                  className="btn btn-primary w-full mt-8"
                >
                  让Deepseek帮我详细分析
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MBTIResultPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <MBTIResultContent />
    </Suspense>
  );
}
