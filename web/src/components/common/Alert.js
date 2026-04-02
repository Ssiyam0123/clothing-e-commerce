export default function Alert({ type, message, onClose }) {
  const styles = {
    success: 'bg-green-50 border-green-500 text-green-700',
    error: 'bg-red-50 border-red-500 text-red-700',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
    info: 'bg-blue-50 border-blue-500 text-blue-700',
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${styles[type]}`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        )}
      </div>
    </div>
  );
}