// components/Toast/Toast.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (event) => {
      const { message, type = 'info' } = event.detail;
      addToast(message, type);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const getToastStyles = (type) => {
    const baseStyles = "max-w-sm rounded-lg shadow-lg p-4 text-white font-medium";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500`;
      case 'error':
        return `${baseStyles} bg-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-500`;
      default:
        return `${baseStyles} bg-gray-500`;
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-[1000] space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          style={{ animation: 'slideInRight 0.3s ease-out' }}
        >
          {toast.message}
        </div>
      ))}
    </div>,
    document.body
  );
};

export default Toast;