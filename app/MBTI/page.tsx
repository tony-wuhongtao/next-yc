import MBTIHero from "@/components/MBTIHero";
import TestCard from "@/components/TestCard";

const testData = [
  {
    imageUrl: "/images/testImg01.jpg",
    altText: "48题测试版",
    title: "MBTI 48题测试版",
    description: "48道选择题，二选一，轻松测试你的人格类型",
    buttonText: "开始测试",
    buttonLink: "/MBTI/Test_48",
  },
  {
    imageUrl: "/images/testImg02.jpg",
    altText: "70题测试版",
    title: "MBTI 70题测试版",
    description: "70道选择题，更全面的测试你的人格类型",
    buttonText: "开始测试",
    buttonLink: "/MBTI/Test_70",
  },
  {
    imageUrl: "/images/testImg03.jpg",
    altText: "93题测试版",
    title: "MBTI 93题测试版",
    description: "93道选择题，超详细的测试你的人格类型",
    buttonText: "开始测试",
    buttonLink: "/MBTI/Test_93",
  },
];

export default function Home() {
  return (
    <div className="relative z-0 overflow-x-clip flex-grow">
      <MBTIHero />
      <div className="bg-base-200 min-h-screen pt-0 flex-col flex">
        <div className="container mx-auto">
          {/* 修改卡片布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-base-100 shadow-xl rounded-lg">
              <figure className="px-10 pt-10">
                <img src="/images/16.png" className="rounded-xl" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">4大维度,16种人格类型</h2>
                <ul>
                  <li>外向—内向 (E—I)</li>
                  <li>感觉—直觉 (S—N)</li>
                  <li>思维—情感 (T—F)</li>
                  <li>判断—知觉 (J—P)</li>
                </ul>
              </div>
            </div>

            {testData.map((data, index) => (
              <div key={index} className="w-full max-w-2xl">
                <TestCard
                  imageUrl={data.imageUrl}
                  altText={data.altText}
                  title={data.title}
                  description={data.description}
                  buttonText={data.buttonText}
                  buttonLink={data.buttonLink}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
