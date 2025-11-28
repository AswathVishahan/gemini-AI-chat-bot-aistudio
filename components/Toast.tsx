import React, { useState, useEffect } from 'react';

interface ToastProps {
  message?: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2800);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}
    >
      {message && (
        <div className="bg-gray-800 text-white font-semibold py-2 px-5 rounded-full shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default Toast;
