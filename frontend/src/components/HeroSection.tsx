import { Leaf, Truck, RotateCcw, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onShopNowClick: () => void;
}

export function HeroSection({ onShopNowClick }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#f7f5f0] border-b border-gray-100">
      <div className="max-w-[1380px] mx-auto min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex flex-col lg:flex-row items-stretch">
        {/* Left Column: Headlines, CTA, and Benefit Row */}
        <div className="w-full lg:w-[48%] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 flex flex-col justify-between z-10">
          <div>
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold text-gray-950 tracking-[-0.03em] leading-[1.12]">
              Everything you need,<br />
              <span className="block mt-1">in one place.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 font-normal mt-4 mb-7 max-w-md leading-relaxed">
              Everyday tech, smart electronics & accessories, delivered with care.
            </p>

            {/* Shop Now CTA Button */}
            <button
              onClick={onShopNowClick}
              className="inline-flex items-center gap-2 bg-[#1c1d1f] hover:bg-black text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900/30"
              aria-label="Shop now for electronics & tech essentials"
            >
              <span>Shop tech</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Hero Benefits Row */}
          <div className="mt-12 lg:mt-16 pt-2">
            <div className="inline-flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Benefit 1: 100% Genuine */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4 text-novagreen-800 fill-novagreen-800" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  100% Genuine
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-5 w-[1px] bg-gray-300/80" aria-hidden="true" />

              {/* Benefit 2: Quick delivery */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-novagreen-800 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  Quick delivery
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-5 w-[1px] bg-gray-300/80" aria-hidden="true" />

              {/* Benefit 3: Easy returns */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 text-novagreen-800 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  Easy returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Res Lifestyle Hero Image */}
        <div className="w-full lg:w-[54%] relative min-h-[320px] sm:min-h-[400px] lg:min-h-[500px]">
          <img
            src="/assets/hero-banner.jpg"
            alt="NovaMart everyday essentials, fresh groceries, coffee machine and lifestyle appliances"
            className="w-full h-full object-cover object-center lg:object-left"
          />
          {/* Subtle blend gradient on the left edge for seamless integration */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f7f5f0] to-transparent hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
