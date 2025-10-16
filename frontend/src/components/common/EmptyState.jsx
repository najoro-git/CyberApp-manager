function EmptyState({ icon: Icon, title, message, action, actionText }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
      {Icon && (
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-6 rounded-2xl border border-cyan-500/30">
            <Icon className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-lg mb-6">{message}</p>
      {action && actionText && (
        <button
          onClick={action}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;