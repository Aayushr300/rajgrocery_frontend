"use client";

export function Modal({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={() => onOpenChange(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
