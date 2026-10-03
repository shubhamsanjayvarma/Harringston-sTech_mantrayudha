import { ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface PopularSectionProps {
  products: Product[];
  title?: string;
  onViewAllClick: () => void;
  isFiltered?: boolean;
}

export function PopularSection({
  products,
  title = 'Popular right now',
  onViewAllClick,
  isFiltered = false,
}: PopularSectionProps) {
  return (
    <section className="w-full py-10 sm:py-12 bg-white">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-gray-950 tracking-tight">
            {title}
          </h2>

          <button
            onClick={onViewAllClick}
            className="group flex items-center gap-1 text-sm font-semibold text-novagreen-700 hover:text-novagreen-800 transition-colors focus:outline-none"
            aria-label="View all popular products"
          >
            <span>{isFiltered ? 'Show all' : 'View all'}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Product Cards Grid: Exactly 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
