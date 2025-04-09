"use client";

import { useState, useEffect, Suspense } from "react"; // 引入 Suspense
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // 支持表格、删除线等扩展语法

interface NewsItem {
  id: string;
  content: string;
  createdAt: string;
}

function NewsContent() {
  // 将主要内容提取到一个单独的组件中
  const router = useRouter();
  const searchParams = useSearchParams();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchNews = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/hnews?page=${page}`);
      const data = await res.json();
      setNews(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("获取新闻失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pageStr = searchParams.get("page") || "1";
    const page = parseInt(pageStr);
    fetchNews(page);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    router.push(`/HN?page=${page}`);
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl text-center font-bold mb-4">
        健康与生活新闻 AI每日自动搜索推送
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
            {news && news.length > 0 ? (
              news.map((item) => (
                <div key={item.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="text-xl font-bold text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h3: ({ ...props }) => (
                          <h3
                            className="text-base font-bold mt-1 mb-1"
                            {...props}
                          />
                        ),
                        a: ({ ...props }) => (
                          <a
                            className="text-blue-500 hover:text-blue-700 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                        hr: ({ ...props }) => (
                          <hr
                            className="my-2 border-t-1 border-gray-200"
                            {...props}
                          />
                        ),
                        p: ({ ...props }) => (
                          <p className="whitespace-pre-line mb-2" {...props} />
                        ),
                      }}
                    >
                      {item.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">暂无新闻</div>
            )}
          </div>

          {pagination && pagination.totalPages > 0 && (
            <div className="join mt-8 flex justify-center">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`join-item btn ${
                    page === pagination.currentPage ? "btn-active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <NewsContent />
    </Suspense>
  );
}
