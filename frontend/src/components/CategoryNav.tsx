import React from 'react';
import { Leaf, Smartphone, Home } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Custom precise SVG icons matching the reference screenshot exactly
function GroceriesBasketIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Basket rim & body */}
      <path d="M4 10h16l-2 9H6L4 10z" />
      {/* Handles */}
      <path d="M7 10L12 4l5 6" />
      {/* Mesh lines */}
      <line x1="9" y1="13" x2="9" y2="16" />
      <line x1="12" y1="13" x2="12" y2="16" />
      <line x1="15" y1="13" x2="15" y2="16" />
    </svg>
  );
}

function PersonalCareBottleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Pump head */}
      <path d="M10 3h4" />
      <path d="M12 3v3" />
      <path d="M14 4h2" />
      {/* Bottle neck & body */}
      <rect x="9" y="6" width="6" height="2" rx="0.5" />
      <path d="M8 8h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
      {/* Label line */}
      <line x1="9" y1="13" x2="15" y2="13" strokeDasharray="1 1" />
    </svg>
  );
}

function OffersBadgeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Scalloped badge */}
      <path d="M12 2l2.4 2.4 3.4-.6 1 3.2 3.1 1.5-.6 3.4 2.3 2.5-2.3 2.5.6 3.4-3.1 1.5-1 3.2-3.4-.6L12 22l-2.4-2.4-3.4.6-1-3.2-3.1-1.5.6-3.4-2.3-2.5 2.3-2.5-.6-3.4 3.1-1.5 1-3.2 3.4.6L12 2z" />
      {/* Percent symbol */}
      <line x1="9.5" y1="14.5" x2="14.5" y2="9.5" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
}: CategoryNavProps) {
  const categories = [
    {
      id: 'Groceries',
      name: 'Groceries',
      icon: <GroceriesBasketIcon className="w-5 h-5 text-gray-800 group-hover:text-novagreen-700" />,
    },
    {
      id: 'Fresh',
      name: 'Fresh',
      icon: <Leaf className="w-5 h-5 text-gray-800 group-hover:text-novagreen-700 stroke-[1.8]" />,
    },
    {
      id: 'Electronics',
      name: 'Electronics',
      icon: <Smartphone className="w-5 h-5 text-gray-800 group-hover:text-novagreen-700 stroke-[1.8]" />,
    },
    {
      id: 'Home',
      name: 'Home',
      icon: <Home className="w-5 h-5 text-gray-800 group-hover:text-novagreen-700 stroke-[1.8]" />,
    },
    {
      id: 'Personal Care',
      name: 'Personal Care',
      icon: <PersonalCareBottleIcon className="w-5 h-5 text-gray-800 group-hover:text-novagreen-700" />,
    },
    {
      id: 'Offers',
      name: 'Offers',
      icon: <OffersBadgeIcon className="w-5 h-5 text-gray-800 group-hover:text-novagreen-700" />,
    },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-between overflow-x-auto no-scrollbar py-3.5 gap-2 sm:gap-4">
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <React.Fragment key={cat.id}>
                <li className="flex-1 text-center shrink-0">
                  <button
                    onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                    className={`group w-full flex items-center justify-center gap-2.5 py-1 px-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-novagreen-500/20 ${
                      isSelected
                        ? 'text-novagreen-800 font-bold bg-novagreen-50/70'
                        : 'text-gray-800 font-medium hover:text-gray-950 hover:bg-gray-50'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="shrink-0 transition-transform group-hover:scale-105">
                      {cat.icon}
                    </span>
                    <span className="text-sm font-medium tracking-tight whitespace-nowrap">
                      {cat.name}
                    </span>
                  </button>
                </li>
                {/* Thin vertical divider between categories */}
                {index < categories.length - 1 && (
                  <span
                    className="h-5 w-[1px] bg-gray-200/80 shrink-0 hidden sm:block"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
