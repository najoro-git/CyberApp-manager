import { useState, useCallback } from 'react';

function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, duration = 3000) => {
    const id = Date.now();
    const toast = { id, type, message, duration };
    
    setToasts((prev) => [...prev, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    showToast('success', message, duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    showToast('error', message, duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    showToast('warning', message, duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    showToast('info', message, duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

export default useToast;