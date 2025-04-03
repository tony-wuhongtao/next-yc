"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import Image from "next/image";

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
    <div className="min-h-screen bg-base-200 p-8 relative overflow-hidden">
      {/* Background decorative images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 -top-20 w-96 h-96 opacity-30">
          <Image
            src="/images/decorative.jpg"
            alt="Decorative background"
            fill
            className="rounded-full shadow-2xl object-cover"
          />
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-30">
          <Image
            src="/images/deepseek-color.png"
            alt="Decorative background"
            fill
            className="rounded-full shadow-2xl object-cover"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-50 rounded-xl" />
          <h1 className="text-3xl font-bold mb-8 text-center mt-4 relative">
            <TypingAnimation>AI详细分析和建议</TypingAnimation>
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-50 rounded-xl" />
            <span className="loading loading-spinner loading-lg relative"></span>
            <span className="ml-4 relative">
              基于具体的测试结果，Deepseek V3 正在努力分析中...
            </span>
          </div>
        ) : (
          <div className="bg-base-100 p-6 rounded-box shadow-lg relative overflow-hidden">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-50 rounded-xl" />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/5 relative aspect-8/1">
                <Image
                  src="/images/decorative.jpg"
                  alt="Decorative image"
                  fill
                  className="rounded-xl object-cover shadow-lg"
                />
              </div>
              <div className="prose max-w-none [&>p]:leading-7 [&>ul]:leading-7 [&>ol]:leading-7 flex-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              </div>
              <div className="w-full md:w-0 relative aspect-8/1">
                <Image
                  src="/images/decorative.jpg"
                  alt="Decorative image"
                  fill
                  className="rounded-xl object-cover shadow-lg"
                />
              </div>
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
