import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import MyAccount from './pages/MyAccount';
import Wishlist from './pages/Wishlist';
import Offers from './pages/Offers';
import SearchResults from './pages/SearchResults';
import HelpSupport from './pages/HelpSupport';

function ScrollToTop() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<><ScrollToTop /><Home /></>} />
          <Route path="category" element={<><ScrollToTop /><Category /></>} />
          <Route path="product" element={<><ScrollToTop /><ProductDetails /></>} />
          <Route path="cart" element={<><ScrollToTop /><Cart /></>} />
          <Route path="checkout" element={<><ScrollToTop /><Checkout /></>} />
          <Route path="order-confirmed" element={<><ScrollToTop /><OrderConfirmed /></>} />
          <Route path="account" element={<><ScrollToTop /><MyAccount /></>} />
          <Route path="wishlist" element={<><ScrollToTop /><Wishlist /></>} />
          <Route path="offers" element={<><ScrollToTop /><Offers /></>} />
          <Route path="search" element={<><ScrollToTop /><SearchResults /></>} />
          <Route path="help" element={<><ScrollToTop /><HelpSupport /></>} />
        </Route>
      </Routes>
    </Router>
  );
}
