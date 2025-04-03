"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function LLMContent() {
  const searchParams = useSearchParams();
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/llm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            I: Number(searchParams.get("I")),
            E: Number(searchParams.get("E")),
            S: Number(searchParams.get("S")),
            N: Number(searchParams.get("N")),
            T: Number(searchParams.get("T")),
            F: Number(searchParams.get("F")),
            J: Number(searchParams.get("J")),
            P: Number(searchParams.get("P")),
          }),
        });

        if (!res.ok) throw new Error("请求失败");

        const data = await res.json();
        setResponse(data.message || data.choices[0].message.content);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setResponse("请求出错，请稍后重试, error: " + errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center mt-4">
          AI详细分析和建议
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-4">
              基于具体的测试结果，Deepseek V3 正在努力分析中...
            </span>
          </div>
        ) : (
          <div className="bg-base-100 p-6 rounded-box shadow">
            <div className="prose max-w-none [&>p]:leading-7 [&>ul]:leading-7 [&>ol]:leading-7">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LLMPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LLMContent />
    </Suspense>
  );
}
