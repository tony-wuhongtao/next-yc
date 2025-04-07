"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

export default function Datareport() {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const reportsPerPage = 20;

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch(`/api/reports?page=${currentPage}&limit=${reportsPerPage}`);
      if (!response.ok) {
        console.error("Failed to fetch reports");
        return;
      }
      const data = await response.json();
      setReports(data.reports);
      setTotalReports(data.total);
    };
    fetchReports();
  }, [currentPage]);

  return (
    <div className="p-4 sm:p-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl sm:text-2xl font-bold mb-4">报告数据</h2>
          {reports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名称</th>
                    <th>测试类型</th>
                    <th>时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td className="whitespace-nowrap">{report.name}</td>
                      <td className="whitespace-nowrap">{report.testType}</td>
                      <td className="whitespace-nowrap">{new Date(report.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => setSelectedReport(report)}
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500">暂无数据</div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <div className="text-sm sm:text-base">
              共 {totalReports} 条报告，当前第 {currentPage} 页
            </div>
            <div className="join">
              <button
                className="join-item btn btn-sm sm:btn-md"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                上一页
              </button>
              <button
                className="join-item btn btn-sm sm:btn-md"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage * reportsPerPage >= totalReports}
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedReport && (
        <Modal onClose={() => setSelectedReport(null)}>
          <h3 className="text-lg font-bold mb-4">报告详情</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            <p><strong>ID:</strong> {selectedReport.id}</p>
            <p><strong>名称:</strong> {selectedReport.name}</p>
            <p><strong>测试类型:</strong> {selectedReport.testType}</p>
            <p><strong>时间:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
            <p><strong>I（内向）:</strong> {selectedReport.I}</p>
            <p><strong>E（外向）:</strong> {selectedReport.E}</p>
            <p><strong>S（实感）:</strong> {selectedReport.S}</p>
            <p><strong>N（直觉）:</strong> {selectedReport.N}</p>
            <p><strong>T（思考）:</strong> {selectedReport.T}</p>
            <p><strong>F（情感）:</strong> {selectedReport.F}</p>
            <p><strong>J（判断）:</strong> {selectedReport.J}</p>
            <p><strong>P（知觉）:</strong> {selectedReport.P}</p>
            <p><strong>内容:</strong> {selectedReport.content}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
