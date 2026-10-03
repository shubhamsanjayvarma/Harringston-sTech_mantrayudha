import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag,
  Smartphone,
  Home as HomeIcon,
  Droplet,
  Percent,
  Leaf
} from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { PopularSection } from '../components/PopularSection';
import { POPULAR_PRODUCTS } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();

  const domainCategories = [
    {
      name: 'Groceries',
      title: 'Daily Groceries',
      subtitle: 'Atta, Dals, Spices & Oils',
      icon: ShoppingBag,
      badge: 'Staples',
      link: '/category?name=Groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Fresh',
      title: 'Fresh Farm Produce',
      subtitle: 'Fruits, Veggies & Herbs',
      icon: Leaf,
      badge: 'Farm Direct',
      link: '/category?name=Fresh',
      image: '/assets/strawberries.jpg'
    },
    {
      name: 'Electronics',
      title: 'Smart Electronics',
      subtitle: 'Audio, Wearables & Cables',
      icon: Smartphone,
      badge: 'Top Brands',
      link: '/category?name=Electronics',
      image: '/assets/headphones.jpg'
    },
    {
      name: 'Home',
      title: 'Home & Kitchen',
      subtitle: 'Appliances, Storage & Decor',
      icon: HomeIcon,
      badge: 'Lifestyle',
      link: '/category?name=Home',
      image: '/assets/air-fryer.jpg'
    },
    {
      name: 'Personal Care',
      title: 'Personal Care',
      subtitle: 'Skincare, Hair & Wellness',
      icon: Droplet,
      badge: 'Self Care',
      link: '/category?name=Personal%20Care',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Offers',
      title: 'Mega Discounts',
      subtitle: 'Save up to 40% Daily',
      icon: Percent,
      badge: 'Hot Deals',
      link: '/offers',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleShopNow = () => {
    navigate('/category?name=Groceries');
  };

  const handleViewAll = () => {
    navigate('/category?name=Groceries');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection onShopNowClick={handleShopNow} />

      {/* Explore by Domain / Section (Bifurcation Hub) */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-2">
          <div>
            <h2 className="text-2xl sm:text-[28px] font-extrabold text-gray-950 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select any section to view dedicated, domain-specific products
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {domainCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.link}
                className="group flex flex-col p-4 rounded-2xl border border-gray-200 bg-white hover:border-[#198038] hover:shadow-md transition-all text-center items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden p-2">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/strawberries.jpg';
                    }}
                  />
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#198038] mb-1">
                  <Icon size={12} /> {cat.badge}
                </div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#198038] transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{cat.subtitle}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Section */}
      <PopularSection
        products={POPULAR_PRODUCTS}
        onViewAllClick={handleViewAll}
      />
    </div>
  );
}
