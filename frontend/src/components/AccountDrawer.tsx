import { X, User, MapPin, Package, ShieldCheck, Heart, LogOut } from 'lucide-react';
import { DeliveryLocation } from '../types';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: DeliveryLocation;
}

export function AccountDrawer({
  isOpen,
  onClose,
  currentLocation,
}: AccountDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-950">
              My NovaMart Account
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close account drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="p-5 overflow-y-auto space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-novagreen-700 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                JD
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-950">
                  John Doe
                </h3>
                <p className="text-xs text-gray-500">
                  +91 98765 43210 • john.doe@example.com
                </p>
                <div className="inline-flex items-center gap-1 bg-[#dcfce7] text-novagreen-800 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>NovaMart VIP Member</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1">
              <div className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center justify-between text-sm font-medium text-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-novagreen-700" />
                  <span>My Orders</span>
                </div>
                <span className="text-xs text-gray-400">2 active</span>
              </div>

              <div className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center justify-between text-sm font-medium text-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-novagreen-700" />
                  <span>Delivery Address</span>
                </div>
                <span className="text-xs text-gray-500">{currentLocation.area}</span>
              </div>

              <div className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center justify-between text-sm font-medium text-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-novagreen-700" />
                  <span>Saved Favourites</span>
                </div>
                <span className="text-xs text-gray-400">8 items</span>
              </div>

              <div className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center justify-between text-sm font-medium text-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-novagreen-700" />
                  <span>Profile Settings</span>
                </div>
              </div>
            </div>

            {/* Delivery Darkstore info */}
            <div className="p-4 bg-[#f0f9f1] border border-[#d2edd7] rounded-2xl text-xs text-novagreen-950 space-y-1">
              <p className="font-bold">Connected Dark Store</p>
              <p className="text-gray-600">
                NovaMart Hub #{currentLocation.pincode} • Instant 10m pick & pack
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
