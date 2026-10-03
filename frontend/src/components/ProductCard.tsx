import { Zap, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-4 transition-all duration-200 hover:shadow-md hover:border-gray-200/90 flex gap-4 items-stretch">
      {/* Left: Square Product Image */}
      <div className="w-[125px] sm:w-[135px] shrink-0 bg-[#f9fafb] rounded-xl flex items-center justify-center p-2 border border-gray-100/70 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Right: Info, Price, Badge & Add Button */}
      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
        <div>
          <h3 className="font-bold text-[14px] sm:text-[15px] text-gray-950 leading-snug line-clamp-2 group-hover:text-novagreen-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 font-normal mt-0.5">
            {product.subtitle}
          </p>
        </div>

        <div className="mt-2.5 space-y-2">
          {/* Price */}
          <div className="font-extrabold text-base sm:text-lg text-gray-950 tracking-tight">
            ₹ {product.price.toLocaleString('en-IN')}
          </div>

          {/* Delivery Time Badge */}
          <div className="inline-flex items-center gap-1 bg-[#eaf6ec] text-novagreen-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 fill-novagreen-700 text-novagreen-700" />
            <span>{product.deliveryTime}</span>
          </div>

          {/* Add / Stepper Button */}
          <div className="pt-1">
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-[#1c7b39] hover:bg-[#156d30] active:bg-[#125827] text-white text-xs sm:text-sm font-semibold py-1.5 sm:py-2 px-3 rounded-lg transition-colors duration-150 shadow-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-novagreen-500/20"
                aria-label={`Add ${product.name} to cart`}
              >
                Add
              </button>
            ) : (
              <div className="w-full bg-[#1c7b39] text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-between px-2 py-1 shadow-xs">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="p-0.5 hover:bg-black/20 rounded transition-colors"
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold px-1.5 text-xs sm:text-sm">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="p-0.5 hover:bg-black/20 rounded transition-colors"
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
