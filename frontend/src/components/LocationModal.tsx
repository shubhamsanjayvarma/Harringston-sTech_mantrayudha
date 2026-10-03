import { useState } from 'react';
import { X, MapPin, Check, Search } from 'lucide-react';
import { LOCATIONS } from '../data/mockData';
import { DeliveryLocation } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: DeliveryLocation;
  onSelectLocation: (location: DeliveryLocation) => void;
}

export function LocationModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLocations = LOCATIONS.filter(
    (loc) =>
      loc.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.pincode.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-novagreen-50 flex items-center justify-center text-novagreen-700">
              <MapPin className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 id="location-modal-title" className="text-base font-bold text-gray-950">
                Choose Delivery Location
              </h3>
              <p className="text-xs text-gray-500">
                Ultra-fast 10-15 minute grocery & lifestyle delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-100 bg-[#fafafa]">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search area or pincode..."
              className="w-full pl-9 pr-4 py-2 bg-white text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-novagreen-600 focus:ring-1 focus:ring-novagreen-600"
            />
          </div>
        </div>

        {/* Locations List */}
        <div className="p-3 max-h-72 overflow-y-auto divide-y divide-gray-50">
          {filteredLocations.map((loc) => {
            const isSelected = loc.id === currentLocation.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                  isSelected
                    ? 'bg-novagreen-50/80 text-novagreen-900'
                    : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-novagreen-700 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-950">
                      {loc.area}
                    </p>
                    <p className="text-xs text-gray-500">
                      {loc.city} - {loc.pincode} • ETA: {loc.eta}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-novagreen-700 shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Currently delivering across Bengaluru dark stores with ⚡ 10-15m ETA
          </p>
        </div>
      </div>
    </div>
  );
}
