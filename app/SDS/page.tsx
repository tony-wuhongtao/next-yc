import SDSHero from "@/components/SDSHero";
import TestCard from "@/components/TestCard";

const testData = [
  {
    imageUrl: "/images/sds60.jpg",
    altText: "霍兰德职业兴趣测试",
    title: "霍兰德职业兴趣测试 60题简洁版",
    description:
      "本测试是美著名心理学家John L. Holland.（1919-2008）研发的，目的是帮助人们发觉自己更感兴趣、更有潜力从事的职业。为了测出最准确的结果，请务必按照直觉回答每一个问题。千万不要被世俗的判断和别人的评价所影响。霍兰德职业兴趣测试在学术界颇受好评。",
    buttonText: "快速测试",
    buttonLink: "/SDS/Test?type=60",
  },
  {
    imageUrl: "/images/sds120.jpg",
    altText: "霍兰德职业兴趣测试",
    title: "霍兰德职业兴趣和能力测试 120题完整版",
    description:
      "霍兰德职业兴趣测试在高考志愿填报、职业选择、职业培训等方法具有较高的参考指导作用。尤其是高考填表志愿，大学选专业方面霍兰德职业兴趣测试都属于必不可少工具。兴趣和职业存在紧密的关系，兴趣也是推动我们探索求知的主要动力，带有兴趣工作可以使得我们学习主动性更强，克服困难的能力更强，从而确保我们在职业发展上能持续不断的深入，获取竞争优势，提升职业价值。",
    buttonText: "快速测试",
    buttonLink: "/SDS/Test?type=120",
  },
];

export default function Home() {
  return (
    <div className="relative z-0 overflow-x-clip flex-grow">
      <SDSHero />
      <div className="bg-base-200 min-h-screen pt-0 flex-col flex">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center my-8">
              六大职业兴趣类型
            </h2>
            <p className="text-lg text-center mb-8">
              霍兰德将职业兴趣划分为六种类型，每种类型反映了不同的个性特点和职业偏好
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* 现实型 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">
                    <span className="badge badge-primary px-2">R</span>
                    现实型（Realistic）
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">特点：</span>
                      注重实践，喜欢操作工具或机械设备，倾向于直接动手解决问题。
                    </p>
                    <p>
                      <span className="font-semibold">典型职业：</span>
                      工程师、建筑工人、机械师、电工、农民。
                    </p>
                    <p>
                      <span className="font-semibold">环境偏好：</span>
                      结构化、以实物为主的环境，例如实验室、车间或户外。
                    </p>
                  </div>
                </div>
              </div>

              {/* 研究型 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">
                    <span className="badge badge-secondary px-2">I</span>
                    研究型（Investigative）
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">特点：</span>
                      好奇心强，注重逻辑分析和科学探索，喜欢研究问题并寻找解决方案。
                    </p>
                    <p>
                      <span className="font-semibold">典型职业：</span>
                      科学家、医生、程序员、数据分析师。
                    </p>
                    <p>
                      <span className="font-semibold">环境偏好：</span>
                      强调创造性思维和独立工作的环境，如研究机构或高等教育环境。
                    </p>
                  </div>
                </div>
              </div>

              {/* 艺术型 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">
                    <span className="badge badge-accent px-2">A</span>
                    艺术型（Artistic）
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">特点：</span>
                      注重创造性和表达自我，富有想象力，追求独特性和情感表达。
                    </p>
                    <p>
                      <span className="font-semibold">典型职业：</span>
                      画家、演员、作家、设计师、音乐家。
                    </p>
                    <p>
                      <span className="font-semibold">环境偏好：</span>
                      非结构化、允许自由表达的环境，如艺术工作室或创意公司。
                    </p>
                  </div>
                </div>
              </div>

              {/* 社会型 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">
                    <span className="badge badge-info px-2">S</span>
                    社会型（Social）
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">特点：</span>
                      乐于助人，善于沟通和团队合作，喜欢教育、咨询或社会服务工作。
                    </p>
                    <p>
                      <span className="font-semibold">典型职业：</span>
                      教师、心理咨询师、护士、社工、人力资源专家。
                    </p>
                    <p>
                      <span className="font-semibold">环境偏好：</span>
                      支持协作和人际互动的环境，如学校、医院或社区服务机构。
                    </p>
                  </div>
                </div>
              </div>

              {/* 事业型 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">
                    <span className="badge badge-success px-2">E</span>
                    事业型（Enterprising）
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">特点：</span>
                      喜欢领导和影响他人，注重目标达成，有冒险精神和说服能力。
                    </p>
                    <p>
                      <span className="font-semibold">典型职业：</span>
                      销售经理、企业家、律师、政治家、房地产经纪人。
                    </p>
                    <p>
                      <span className="font-semibold">环境偏好：</span>
                      竞争性强、以目标为导向的环境，如企业或市场导向的组织。
                    </p>
                  </div>
                </div>
              </div>

              {/* 传统型 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">
                    <span className="badge badge-warning px-2">C</span>
                    传统型（Conventional）
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">特点：</span>
                      注重规则和细节，喜欢有条理的活动，擅长执行和整理数据。
                    </p>
                    <p>
                      <span className="font-semibold">典型职业：</span>
                      会计师、行政助理、档案管理人员、财务分析师。
                    </p>
                    <p>
                      <span className="font-semibold">环境偏好：</span>
                      高度结构化、注重秩序的环境，如办公室或行政机构。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
