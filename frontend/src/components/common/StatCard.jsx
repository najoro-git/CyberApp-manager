import { TrendingUp, TrendingDown } from 'lucide-react';

function StatCard({ title, value, icon: Icon, gradient, trend, trendValue }) {
  const isPositive = trend === 'up';

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-br ${gradient} p-3 rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-semibold flex items-center gap-1 ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trendValue}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

export default StatCard;