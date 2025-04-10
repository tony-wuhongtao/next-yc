"use client";
import * as React from "react";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 移除 TypeScript 接口定义，改为 JSDoc 注释
/**
 * @typedef {Object} Report
 * @property {string} id
 * @property {string} name
 * @property {string} testType
 * @property {number} I
 * @property {number} E
 * @property {number} S
 * @property {number} N
 * @property {number} T
 * @property {number} F
 * @property {number} J
 * @property {number} P
 * @property {string} createdAt
 * @property {string} content
 */

/**
 * @typedef {Object} PersonalityType
 * @property {string} type
 * @property {string} name
 * @property {string} description
 * @property {string} color
 * @property {string} image
 */

// 计算百分比
const getPercentage = (left, right) => {
  const total = left + right;
  return {
    leftValue: parseFloat(((left / total) * 100).toFixed(2)),
    rightValue: parseFloat(((right / total) * 100).toFixed(2)),
  };
};

function ReportContent({ params }) {
  const [id, setId] = React.useState(null);
  const [report, setReport] = React.useState(null);
  const [personalityType, setPersonalityType] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // 获取 params 中的 id
  React.useEffect(() => {
    const fetchId = async () => {
      const { id } = params;
      setId(id);
    };
    fetchId();
  }, [params]);

  // 获取报告数据
  React.useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/report/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setReport(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // 计算MBTI类型
  const calculateType = (report) => {
    return [
      report.I > report.E ? "I" : "E",
      report.S > report.N ? "S" : "N",
      report.T > report.F ? "T" : "F",
      report.J > report.P ? "J" : "P",
    ].join("");
  };

  const mbtiType = report ? calculateType(report) : "";

  // 获取人格类型描述
  React.useEffect(() => {
    const fetchPersonalityType = async () => {
      const response = await fetch(`/api/personality-des`);
      const data = await response.json();
      const type = mbtiType ? data[mbtiType] : "";

      setPersonalityType({
        type: mbtiType || "",
        name: mbtiType || "",
        description: type || "未找到对应的性格描述",
        color: "#000000",
        image: `/images/character-imgs/${mbtiType?.toUpperCase()}.png`,
      });
    };

    if (mbtiType) {
      fetchPersonalityType();
    }
  }, [mbtiType]);

  const testData = report
    ? {
        type: mbtiType,
        image: `/images/character-imgs/${mbtiType.toUpperCase()}.png`,
        dimensions: [
          {
            left: "I（内向）",
            right: "E（外向）",
            ...getPercentage(report.I, report.E),
          },
          {
            left: "S（实感）",
            right: "N（直觉）",
            ...getPercentage(report.S, report.N),
          },
          {
            left: "T（思考）",
            right: "F（情感）",
            ...getPercentage(report.T, report.F),
          },
          {
            left: "J（判断）",
            right: "P（知觉）",
            ...getPercentage(report.J, report.P),
          },
        ],
      }
    : null;

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  if (!report) {
    return <div>报告未找到</div>;
  }

  // 计算测试题型
const calculateTestType = (report) => {
  const totalScore =
    report.I +
    report.E +
    report.S +
    report.N +
    report.T +
    report.F +
    report.J +
    report.P;
  const roundedTotal = Math.round(totalScore);
  console.log(roundedTotal);

  // 根据总分判断测试类型
  if (roundedTotal === 48) return "48题版";
  if (roundedTotal === 70) return "70题版";
  if (roundedTotal === 95) return "95题版";
  return "未知题型";
  };

  const testType = report ? calculateTestType(report) : "";

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body space-y-8">
          {/* 报告标题 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {report?.name}
              <br />
            </h1>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              MBTI测试报告
            </h2>
            <div className="text-gray-600">
              <span>
                报告生成日期:{" "}
                {new Date(report?.createdAt || "").toLocaleString("zh-CN", {
                  timeZone: "Asia/Shanghai",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <span className="mx-2">|</span>
              <span>测试题型: {testType}</span>
            </div>
          </div>

          {/* 顶部图片和类型标识 */}
          {testData && (
            <>
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
                      <div
                        className="absolute left-0 h-full bg-orange-300 rounded-l-full"
                        style={{ width: `${dimension.leftValue}%` }}
                      />
                      <div
                        className="absolute right-0 h-full bg-indigo-300 rounded-r-full"
                        style={{ width: `${dimension.rightValue}%` }}
                      />
                    </div>

                    {/* 数值标签 */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-800">
                        {dimension.leftValue}%
                      </span>
                      <span className="text-gray-800">
                        {dimension.rightValue}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 描述部分 */}
              <div className="bg-blue-200/20 p-4 rounded-box">
                <div className="text-left text-gray-800 text-lg whitespace-pre-line">
                  {personalityType?.description || (
                    <div className="flex justify-center items-center py-8">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* LLM返回内容 */}
          <div className="bg-blue-200/20 p-4 rounded-box">
            <h2 className="text-xl font-bold mb-4">Deepseek分析结果</h2>
            <hr className="my-4 border-t-2 border-blue-300" />
            <div className="prose prose-lg max-w-none [&>p]:leading-8 [&>ul]:leading-8 [&>ol]:leading-8 flex-1">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  hr: ({ ...props }) => (
                    <hr
                      className="my-4 border-t-2 border-gray-300"
                      {...props}
                    />
                  ),
                }}
              >
                {report.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* 二维码区域 */}
          <div className="bg-blue-200/20 p-4 rounded-box text-center">
            <h3 className="text-lg font-semibold mb-2">
              保存此二维码
              <br />
              随时扫码查看本报告
            </h3>
            <div className="flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}`}
                alt="报告二维码"
                className="w-40 h-40 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  const link = document.createElement("a");
                  link.href = e.currentTarget.src;
                  link.download = `mbti-report-${id}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              />
            </div>
            <p className="text-gray-600 mb-4">
              点击图片保存到本地
              <br />
              可把二维码分享给他们查看本报告
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage({ params }) {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ReportContent params={params} />
    </Suspense>
  );
}
