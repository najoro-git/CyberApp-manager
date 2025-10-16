import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

function Toast({ type = 'info', message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
    },
    error: {
      icon: XCircle,
      gradient: 'from-red-500 to-pink-600',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
    },
    warning: {
      icon: AlertCircle,
      gradient: 'from-orange-500 to-yellow-600',
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/50',
    },
    info: {
      icon: Info,
      gradient: 'from-cyan-500 to-blue-600',
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500/50',
    },
  };

  const { icon: Icon, gradient, bg, border } = config[type];

  return (
    <div className={`fixed top-6 right-6 z-50 backdrop-blur-xl bg-slate-900/95 ${bg} border ${border} rounded-xl p-4 shadow-2xl animate-slide-in-right max-w-md`}>
      <div className="flex items-start gap-3">
        <div className={`bg-gradient-to-br ${gradient} p-2 rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-white flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default Toast;