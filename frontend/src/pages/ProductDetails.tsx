import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Star, ShieldCheck, RotateCcw, Truck, Wrench, CheckCircle2, ChevronRight, Minus, Plus } from 'lucide-react';
import { ALL_PRODUCTS, getProductById, getReviewsForProduct } from '../data/storeData';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productId = searchParams.get('id') || 'PROD-00001';
  const product = getProductById(productId) || ALL_PRODUCTS[0];
  const reviews = getReviewsForProduct(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gray-900">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link to={`/category?cat=${product.category}`} className="hover:text-gray-900">
                {product.category}
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 mb-12">
        {/* Left: Product Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-[#f9fafb] rounded-2xl p-8 relative flex items-center justify-center aspect-square border border-gray-100 overflow-hidden shadow-2xs">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
            />
            {product.discountPercent && product.discountPercent > 5 && (
              <span className="absolute top-4 left-4 bg-[#16a34a] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Info & Buy Box */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-4">
            <span className="inline-block bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-3 py-1 rounded-md mb-2">
              {product.brand} · {product.subcategory || product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-[#fef9ec] border border-[#fef08a] px-2.5 py-0.5 rounded-md">
              <Star className="fill-[#eab308] text-[#eab308]" size={14} />
              <span className="font-bold text-gray-900 text-sm">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount} customer ratings & {reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-black text-gray-900">
              ₹ {product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                ₹ {product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="text-sm font-bold text-[#16a34a]">
                Save {product.discountPercent}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Key Trust Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50/70 rounded-2xl border border-gray-100 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>{product.warrantyMonths} Months Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>Express delivery: {product.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>{product.returnable ? '7-10 Days Returnable' : '10 Days Replacement'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>Color: {product.color || 'Standard'}</span>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-200 rounded-xl px-2 py-1.5 justify-between w-32 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 text-gray-500 hover:text-black"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 text-gray-500 hover:text-black"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-white border border-[#198038] text-[#198038] hover:bg-[#eef8f1] font-bold py-3 px-6 rounded-xl transition-colors text-sm shadow-2xs"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#198038] hover:bg-[#125a27] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm shadow-2xs"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section from reviews.csv */}
      <div className="mt-12 border-t border-gray-100 pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Customer Reviews ({reviews.length > 0 ? reviews.length : 'Verified Ratings'})
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-2xl text-center text-sm text-gray-500">
            No text reviews submitted yet for this product. Be the first to write a review!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.slice(0, 5).map((rev) => (
              <div key={rev.reviewId} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#eab308]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(rev.rating) ? 'fill-[#eab308]' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-gray-900">{rev.title}</span>
                  </div>
                  <span className="text-xs text-gray-400">{rev.reviewDate}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{rev.reviewText}</p>
                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#16a34a] font-semibold mt-2">
                    <CheckCircle2 size={12} /> Verified Purchase
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
