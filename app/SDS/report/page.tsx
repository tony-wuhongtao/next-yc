"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ReportListContent() {
  const searchParams = useSearchParams();
  // 首先定义报告类型接口
  interface SDSReport {
    id: string;
    name: string | null;
    createdAt: string;
    q: string;
  }

  // 在组件中使用
  const [reports, setReports] = useState<SDSReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sds/report?page=${page}`);
        const data = await response.json();

        setReports(data.data);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalItems: data.pagination.totalItems,
        });
      } catch (error) {
        console.error("获取报告列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        加载中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-white shadow-xl mb-8">
          <div className="card-body">
            <h1 className="text-2xl font-bold mb-6">霍兰德测试报告列表</h1>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>昵称</th>
                    <th>测试时间</th>
                    <th>题量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report: SDSReport) => (
                    <tr key={report.id}>
                      <td>{report.name || "匿名用户"}</td>
                      <td>
                        {new Date(report.createdAt).toLocaleString("zh-CN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>{report.q}题</td>
                      <td>
                        <Link
                          href={`/SDS/report/${report.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          查看详情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <div className="join">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`?page=${pageNum}`}
                    className={`join-item btn ${
                      pagination.currentPage === pageNum ? "btn-active" : ""
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function SDSReportList() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          加载中...
        </div>
      }
    >
      <ReportListContent />
    </Suspense>
  );
}
