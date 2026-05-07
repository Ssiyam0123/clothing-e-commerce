"use client";

export default function AdminModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 text-4xl leading-none transition-transform hover:rotate-90"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-10 max-h-[70vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
