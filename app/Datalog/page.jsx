"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

export default function Datalog() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [ipLocation, setIpLocation] = useState(null); 
  const logsPerPage = 20;

  // 新增IP查询函数
  const fetchIpLocation = async (ip) => {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      setIpLocation(data);
    } catch (error) {
      console.error("IP查询失败:", error);
      setIpLocation(null);
    }
  };

  // 修改选中日志处理函数
  const handleSelectLog = (log) => {
    setSelectedLog(log);
    fetchIpLocation(log.ip); 
  };

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch(`/api/logs?page=${currentPage}&limit=${logsPerPage}`);
      if (!response.ok) {
        console.error("Failed to fetch logs");
        return;
      }
      const data = await response.json();
      setLogs(data.logs);
      setTotalLogs(data.total);
    };
    fetchLogs();
  }, [currentPage]);

  return (
    <div className="p-4 sm:p-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl sm:text-2xl font-bold mb-4">日志数据</h2>
          {logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>IP</th>
                    <th>URL</th>
                    <th>客户端</th>
                    <th>时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td className="whitespace-nowrap">{log.ip}</td>
                      <td className="whitespace-nowrap">{log.url}</td>
                      <td className="whitespace-nowrap">{log.client}</td>
                      <td className="whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleSelectLog(log)} 
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
              共 {totalLogs} 条日志，当前第 {currentPage} 页
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
                disabled={currentPage * logsPerPage >= totalLogs}
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedLog && (
        <Modal onClose={() => setSelectedLog(null)}>
          <h3 className="text-lg font-bold mb-4">日志详情</h3>
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedLog.id}</p>
            <p><strong>IP:</strong> {selectedLog.ip}</p>
            {ipLocation && (
              <p><strong>位置:</strong> {ipLocation.city}, {ipLocation.region}, {ipLocation.country_name}</p>
            )}
            <p><strong>URL:</strong> {selectedLog.url}</p>
            <p><strong>客户端:</strong> {selectedLog.client}</p>
            <p><strong>时间:</strong> {new Date(selectedLog.createdAt).toLocaleString()}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
