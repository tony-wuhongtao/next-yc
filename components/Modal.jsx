"use client";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-base-100 p-6 rounded-box w-full max-w-fit md:max-w-2/3 max-h-[90vh] overflow-y-auto">
        {children}
        <div className="mt-4 text-right">
          <button className="btn btn-sm" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
