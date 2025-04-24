import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './pages/auth/Mainlayout';
import Homepage from './pages/homepage/Homepage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ChangePassword from './pages/auth/ChangePassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import { Navigate } from 'react-router-dom';
import Cart from './pages/cart/Cart';
import Orders from './pages/orders/Order';
import Confirm from './pages/orders/Confirm';
import Contact from './pages/orders/Contact';
import Wishlist from './pages/orders/Wishlist';
import ProductDetail from './components/products/ProductDetail';
import Categories from './pages/categories/Categories';
import AuthLayout from './pages/auth/AuthLayout';
import AdminLayout from './pages/auth/AdminLayout';
import Dashboard from './admin/pages/dashboard/Dashboard';
import Products from './admin/pages/products/Products';
import Settings from './admin/pages/settings/Settings';
import AdminOrders from './admin/pages/orders/AdminOrders';

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AppContent />
            </Router>
        </QueryClientProvider>
    );
};

const AppContent: React.FC = () => {
    return (
        <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Confirm />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/categories" element={<Categories />} />
          </Route>
  
          {/* AuthLayout Routes */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
       
  
        {/* Admin routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
  
        {/* Catch all route - 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
};



export default App;
