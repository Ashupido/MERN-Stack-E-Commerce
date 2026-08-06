export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmClasses = 'bg-red-600 hover:bg-red-500',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/40">
        <h2 className="text-xl font-black text-white">{title}</h2>
        <div className="mt-3 text-sm leading-6 text-gray-400">{children}</div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button onClick={onClose} className="rounded-lg border border-gray-700 px-4 py-3 font-bold text-gray-200">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`rounded-lg px-4 py-3 font-black text-white transition ${confirmClasses}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}