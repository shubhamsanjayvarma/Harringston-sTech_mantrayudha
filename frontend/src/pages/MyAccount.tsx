import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Package, MapPin, CreditCard, Heart, HelpCircle, LogOut, ChevronRight, Box, Star, Truck, CheckCircle2 } from 'lucide-react';
import { CURRENT_CUSTOMER, CURRENT_CUSTOMER_ORDERS } from '../data/storeData';

export default function MyAccount() {
  const navigate = useNavigate();
  const customer = CURRENT_CUSTOMER;
  const orders = CURRENT_CUSTOMER_ORDERS;

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
              <span className="text-gray-900 font-medium">My account</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My account</h1>
        <p className="text-lg text-gray-600 mt-1">Hello, {customer.firstName} {customer.lastName}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden mb-6">
            <div className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-[#eef8f1] text-[#198038] rounded-full flex items-center justify-center text-xl font-bold">
                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{customer.name}</h3>
                <p className="text-xs text-gray-500">{customer.email}</p>
                <div className="inline-flex items-center gap-1 mt-1 bg-[#fef9ec] text-[#b45309] text-[11px] font-bold px-2 py-0.5 rounded-full capitalize">
                  {customer.loyaltyTier} Member
                </div>
              </div>
            </div>

            <nav className="flex flex-col text-sm">
              <Link to="/account" className="flex items-center gap-3.5 px-6 py-3.5 bg-[#eef8f1] text-[#198038] font-bold border-l-4 border-[#198038]">
                <Home size={18} />
                Overview
              </Link>
              <Link to="/account" className="flex items-center gap-3.5 px-6 py-3.5 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <Package size={18} className="text-gray-400" />
                My orders ({orders.length})
              </Link>
              <Link to="/account" className="flex items-center gap-3.5 px-6 py-3.5 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <MapPin size={18} className="text-gray-400" />
                Saved address
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3.5 px-6 py-3.5 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <Heart size={18} className="text-gray-400" />
                Wishlist
              </Link>
              <Link to="/help" className="flex items-center gap-3.5 px-6 py-3.5 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <HelpCircle size={18} className="text-gray-400" />
                Help & policies
              </Link>
            </nav>
          </div>

          {/* Customer Address Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
            <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-[#198038]" /> Primary Address
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {customer.address}<br />
              {customer.city}, {customer.state} - {customer.pincode}<br />
              Phone: {customer.phone}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
              <p className="text-xs font-medium text-gray-500 mb-1">Total Orders</p>
              <p className="text-2xl font-black text-gray-900">{customer.totalOrders}</p>
            </div>
            <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
              <p className="text-xs font-medium text-gray-500 mb-1">Lifetime Spend</p>
              <p className="text-2xl font-black text-[#198038]">₹ {customer.totalSpend.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
              <p className="text-xs font-medium text-gray-500 mb-1">Loyalty Tier</p>
              <p className="text-2xl font-black text-gray-900 capitalize">{customer.loyaltyTier}</p>
            </div>
            <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
              <p className="text-xs font-medium text-gray-500 mb-1">Member Since</p>
              <p className="text-lg font-bold text-gray-700 mt-1">{customer.customerSince}</p>
            </div>
          </div>

          {/* Recent Orders from orders.csv & order_items.csv */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Order History ({orders.length})
              </h2>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.orderId} className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
                  <div className="p-4 sm:p-5 flex flex-wrap justify-between items-start gap-4 bg-gray-50/60 border-b border-gray-100">
                    <div>
                      <span className="font-extrabold text-gray-900 text-sm">{order.orderId}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{order.orderDate}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="font-extrabold text-gray-900 text-sm">₹ {order.totalAmount.toLocaleString('en-IN')}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Courier & Tracking</p>
                      <p className="font-semibold text-gray-900 text-xs">{order.courier}: {order.trackingNumber}</p>
                    </div>

                    <div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.orderStatus === 'delivered'
                          ? 'bg-[#dcfce7] text-[#166534]'
                          : 'bg-[#e0f2fe] text-[#0369a1]'
                      }`}>
                        <CheckCircle2 size={12} /> {order.orderStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.orderItemId} className="flex items-center justify-between gap-4 py-1">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100"
                            />
                          )}
                          <div>
                            <Link to={`/product?id=${item.productId}`} className="font-bold text-sm text-gray-900 hover:text-[#198038] transition-colors">
                              {item.productName}
                            </Link>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} · Price: ₹ {item.unitPrice.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-sm text-gray-900">
                            ₹ {item.finalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Delivered to: <span className="text-gray-700 font-medium">{order.shippingAddress}</span>
                    </p>
                    <Link
                      to="/help"
                      className="text-xs font-bold text-[#198038] hover:underline"
                    >
                      Need Help with this order?
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
