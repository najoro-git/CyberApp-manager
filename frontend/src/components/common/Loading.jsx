import { Loader2 } from 'lucide-react';

function Loading({ message = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
}

export default Loading;