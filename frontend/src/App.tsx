import { useState, useRef } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { HeroSection } from './components/HeroSection';
import { PopularSection } from './components/PopularSection';
import { CartDrawer } from './components/CartDrawer';
import { LocationModal } from './components/LocationModal';
import { AccountDrawer } from './components/AccountDrawer';
import { Toast } from './components/Toast';
import { LOCATIONS, POPULAR_PRODUCTS, ALL_PRODUCTS } from './data/mockData';
import { DeliveryLocation } from './types';

export function App() {
  const [currentLocation, setCurrentLocation] = useState<DeliveryLocation>(LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const popularSectionRef = useRef<HTMLDivElement>(null);

  const handleShopNowClick = () => {
    popularSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    setShowAllProducts(false);
    if (category) {
      popularSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAllClick = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
      setShowAllProducts(false);
    } else {
      setShowAllProducts((prev) => !prev);
    }
  };

  // Compute displayed products based on filters
  const displayedProducts = selectedCategory
    ? ALL_PRODUCTS.filter((p) => p.category === selectedCategory)
    : showAllProducts
    ? ALL_PRODUCTS
    : POPULAR_PRODUCTS;

  const sectionTitle = selectedCategory
    ? `${selectedCategory} Essentials`
    : showAllProducts
    ? 'All Curated Products'
    : 'Popular right now';

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900 font-sans">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Header */}
      <Header
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />

      {/* 3. Category Navigation */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      <main className="flex-1">
        {/* 4 & 5 & 6. Hero Section with Headline, CTA, Lifestyle Image & Benefits Row */}
        <HeroSection onShopNowClick={handleShopNowClick} />

        {/* 7 & 8 & 9. Popular Right Now & Product Cards */}
        <div ref={popularSectionRef}>
          <PopularSection
            products={displayedProducts}
            title={sectionTitle}
            onViewAllClick={handleViewAllClick}
            isFiltered={Boolean(selectedCategory) || showAllProducts}
          />
        </div>
      </main>

      {/* Modals & Overlays */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
      />

      <CartDrawer currentLocation={currentLocation} />

      <AccountDrawer
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentLocation={currentLocation}
      />

      <Toast />
    </div>
  );
}

export default App;
