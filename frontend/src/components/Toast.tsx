import { CheckCircle2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Toast() {
  const { toastMessage, dismissToast, setIsCartOpen } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="bg-gray-950 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-800">
        <CheckCircle2 className="w-5 h-5 text-novagreen-400 shrink-0" />
        <span className="text-sm font-medium pr-2">{toastMessage}</span>
        <button
          onClick={() => {
            dismissToast();
            setIsCartOpen(true);
          }}
          className="text-xs font-bold bg-novagreen-700 hover:bg-novagreen-600 text-white px-2.5 py-1 rounded-lg transition-colors"
        >
          View Cart
        </button>
        <button
          onClick={dismissToast}
          className="text-gray-400 hover:text-white p-0.5 ml-1 transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
