"use client";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import QRCode from 'react-qr-code';

const dimensionNames = {
  R: "现实型",
  I: "研究型", 
  A: "艺术型",
  S: "社会型",
  E: "企业型",
  C: "传统型"
};

const dimensionColors = {
  R: "badge-warning",
  I: "badge-primary",
  A: "badge-secondary",
  S: "badge-accent",
  E: "badge-info",
  C: "badge-success"
};

export default function SDSReportPage() {
  const params = useParams();
  const pathname = usePathname();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });
  const [totalQuestions, setTotalQuestions] = useState(60);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/sds/report/${params.id}`);
        const data = await response.json();
        if (data) {
          setReport(data);
          setScores({
            R: parseInt(data.R),
            I: parseInt(data.I),
            A: parseInt(data.A),
            S: parseInt(data.S),
            E: parseInt(data.E),
            C: parseInt(data.C)
          });
          setTotalQuestions(parseInt(data.q));
        }
      } catch (error) {
        console.error('获取报告失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
  }

  if (!report) {
    return <div className="flex justify-center items-center min-h-screen">报告未找到</div>;
  }

  // 计算每个维度的理论最高分
  const maxScorePerDimension = totalQuestions === 120 ? 20 : 10;
  
  // 计算最高分的三个维度
  const topDimensions = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dimension]) => dimension);

  const radarData = Object.entries(scores).map(([key, value]) => ({
    subject: `${dimensionNames[key]}-${key}`,
    score: value,
    fullMark: maxScorePerDimension,
  }));

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div id="report-container" className="card bg-white shadow-xl mb-8">
          <div className="card-body">
            <h1 id="report-title" className="text-3xl font-bold text-center mb-6">
              {report.name ? `${report.name}的` : '您的'}霍兰德职业兴趣测试结果 ({totalQuestions}题版)
            </h1>
            
            {report.createdAt && (
              <p className="text-center text-gray-500 mb-6">
                测试时间：{new Date(report.createdAt).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </p>
            )}
            
            {/* 雷达图部分保持不变 */}
            <div className="mt-8 mb-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="90%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 16 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, maxScorePerDimension]} />
                  <Radar
                    name="得分"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.8}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 各维度得分详情 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                【各维度得分详情】
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(scores).map(([dimension, score]) => (
                  <div key={dimension} className="card bg-base-100 shadow">
                    <div className="card-body">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 badge ${dimensionColors[dimension]}`}>
                          {dimensionNames[dimension]} ({dimension})
                        </span>
                        <span className="text-xl font-bold">
                          {score}分 / {maxScorePerDimension}分
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div 
                          className="bg-blue-600 h-4 rounded-full" 
                          style={{ width: `${(score/maxScorePerDimension*100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 结果解释 */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">结果解读</h2>
              <p>
                根据霍兰德职业兴趣理论，您的职业兴趣类型组合为 <strong>{topDimensions.join("")}</strong>，
                这表明您在 {topDimensions.map(d => dimensionNames[d]).join("、")} 方面有较强的兴趣倾向。
              </p>
              <p className="mt-4">
                这种组合类型的人通常适合从事需要{topDimensions.map(d => {
                  const traits = {
                    R: "动手操作能力",
                    I: "分析思考能力",
                    A: "创造表达能力", 
                    S: "人际交往能力",
                    E: "领导管理能力",
                    C: "组织执行能力"
                  };
                  return traits[d];
                }).join("、")}的工作。
              </p>
            </div>
            
            {/* 报告内容显示区域 */}
            {report.content && (
              <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">霍兰德职业分析详细报告</h2>
                <div className="prose max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-3xl font-bold my-4 text-blue-800" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-2xl font-semibold my-3 text-blue-600" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-xl my-2 font-bold text-blue-600" {...props} />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4 className="text-xl my-2 font-bold text-blue-500" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="my-3 leading-relaxed" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-bold text-blue-700" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic text-gray-600" {...props} />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr className="my-6 border-t-2 border-gray-300" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-6 my-3" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-6 my-3" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="my-1" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" {...props} />
                      ),
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match?.[1] || 'text'}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>
                            {children}
                          </code>
                        );
                      },
                      a: ({ node, ...props }) => (
                        <a className="text-blue-500 hover:underline" {...props} />
                      ),
                    }}
                  >
                    {report.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* 分享区域 */}
            <div className="mt-6 text-center">
              <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium">分享此报告给朋友</h3>
                
                {/* 修改为水平排列的二维码容器 */}
                <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-white border rounded">
                      <QRCode 
                        value={`${window.location.origin}${pathname}`}
                        size={128}
                        level="H"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">此报告二维码地址</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-white border rounded">
                      <QRCode 
                        value="http://next.xiaotuxp.com/SDS/" 
                        size={128}
                        level="H"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">扫码免费测试</p>
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
