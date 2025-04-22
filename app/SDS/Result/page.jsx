"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
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

function ResultContent() {
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState(null);
  const [nickname, setNickname] = useState('');

  // 从URL参数获取各维度分数和题目总数
  const scores = {
    R: parseInt(searchParams.get("R") || "0"),
    I: parseInt(searchParams.get("I") || "0"),
    A: parseInt(searchParams.get("A") || "0"),
    S: parseInt(searchParams.get("S") || "0"),
    E: parseInt(searchParams.get("E") || "0"),
    C: parseInt(searchParams.get("C") || "0")
  };
  const totalQuestions = parseInt(searchParams.get("q") || "60");

  // 生成报告函数
  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/sds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...scores,
          q: totalQuestions
        })
      });
      const data = await response.json();
      setReportContent(data.output);
    } catch (error) {
      console.error('生成报告失败:', error);
      setReportContent('报告生成失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveReport = async () => {
    if (!nickname.trim()) {
      alert('请输入昵称');
      return;
    }

    try {
      setIsGenerating(true); // 添加加载状态
      const response = await fetch('/api/sds/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nickname,
          ...scores,
          q: totalQuestions,
          content: reportContent
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '保存报告失败');
      }

      if (data.data?.id) {
        window.location.href = `/SDS/report/${data.data.id}`;
      }
    } catch (error) {
      console.error('保存报告失败:', error);
      alert(error.message || '保存报告失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

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
              {nickname ? `${nickname}的` : '您的'}霍兰德职业兴趣测试结果 ({totalQuestions}题版)
            </h1>
            
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
              
              {/* 生成报告按钮 */}
              {!reportContent && (
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={generateReport}
                    className="btn btn-primary"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        正在生成报告，给Deepseek一点时间...
                      </>
                    ) : '免费让Deepseek帮我生成详细报告'}
                  </button>
                </div>
              )}
            </div>
            
            {/* 报告内容显示区域 */}
            {reportContent && (
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
                    {reportContent}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* 报告生成后的操作区域 */}
            {reportContent && (
              <div className="mt-6 text-center">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">输入昵称<span className="text-red-500">*</span></span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="您的昵称" 
                      className="input input-bordered w-full max-w-xs"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    onClick={saveReport}
                    className="btn btn-primary mt-6 md:mt-8"
                  >
                    生成永久报告链接
                  </button>
                </div>
                
                <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium">分享测试给朋友</h3>
                  <div className="p-4 bg-white border rounded">
                    <QRCode 
                      value="http://next.xiaotuxp.com/SDS/" 
                      size={128}
                      level="H"
                    />
                  </div>
                  <p className="text-sm text-gray-600">扫码免费测试</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SDSResult() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ResultContent />
    </Suspense>
  );
}