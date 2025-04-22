"use client";
import React from "react";

function Hero() {
  return (
    <div className="hero bg-base-200 min-h-[50vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div>
          <h1 className="text-3xl font-bold">霍兰德职业适应性免费测试</h1>

          <div className="card bg-base-100 shadow-lg my-4">
            <div className="card-body">
              <img
                src="/images/sds.jpg"
                className="max-w-full h-auto rounded-lg"
              />
              <div className="text-lg">
                霍兰德职业适应性测验(Self-Directed Search),简称SDS <br />
                由美国著名职业指导专家
                Ｊ.霍兰德（ＨＯＬＬＡＮＤ）编制。在几十年间经过一百多次大规模的实验研究
                <br />
                形成了人格类型与职业类型的学说和测验。该测验能帮助被试者发现和确定自己的职业兴趣和能力专长,从而科学地做出求职择业。
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="card bg-base-100 shadow-lg my-4">
            <div className="card-body">
              <div className="text-lg">
                <span className="font-bold text-primary">
                  霍兰德职业兴趣和能力测试是一种广泛应用于教育培训、高考志愿填报选专业、大学生职业规划、企业人才招聘和人力资源管理等领域的测试工具。
                </span>
                <br />
                <br />
                霍兰德的类型理论将个体的特质与适合这些特质的工作联系在一起，强调职业生涯的探索，将个人的擅长、优势和兴趣偏好进行整合。
                <br />
                <br />
                通过霍兰德职业兴趣测试可以快速分析出个体的职业发展方向，帮助个体更好地了解自我，并选择与个人特质相符合的职业，实现职业规划和目标的达成。
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg my-4">
            <div className="card-body">
              <div className="text-lg">
                霍兰德职业兴趣理论将人格类型分为六维人格模型（RIASEC）​：
                <br />
                <br />
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="badge badge-warning mx-1 px-2">
                    <b>现实型（R）</b>
                  </span>
                  <span className="badge badge-primary mx-1 px-2">
                    <b>研究型（I）</b>
                  </span>
                  <span className="badge badge-secondary mx-1 px-2">
                    <b>艺术型（A）</b>
                  </span>
                  <span className="badge badge-accent mx-1 px-2">
                    <b>社会型（S）</b>
                  </span>
                  <span className="badge badge-info mx-1 px-2">
                    <b>企业型（E）</b>
                  </span>
                  <span className="badge badge-success mx-1 px-2">
                    <b>传统型（C）</b>
                  </span>
                </div>
                <br />
                <div className="divider"></div>
                <span className="font-bold text-primary">
                  不同的维度组合形成不同的职业兴趣特征倾向。
                </span>
                <br />
                <br />
                通过对个体进行测试并根据测试结果来分析其在某些领域和岗位上更加擅长，以及更容易取得职业成就。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
