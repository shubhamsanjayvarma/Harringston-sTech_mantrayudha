import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { PopularSection } from '../components/PopularSection';
import { POPULAR_PRODUCTS } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/category');
  };

  const handleViewAll = () => {
    navigate('/category');
  };

  return (
    <div className="w-full">
      <HeroSection onShopNowClick={handleShopNow} />
      <PopularSection
        products={POPULAR_PRODUCTS}
        onViewAllClick={handleViewAll}
      />
    </div>
  );
}
