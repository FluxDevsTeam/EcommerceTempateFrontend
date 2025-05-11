import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./pages/auth/AuthContext";
import Mainlayout from "./pages/auth/Mainlayout";
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyForgotPassword from "./pages/auth/VerifyForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { Navigate } from "react-router-dom";
import Cart from "./pages/cart/Cart";
import ConfirmOrder from "./pages/cart/ConfirmOrder";
import FAQs from "./pages/cart/FAQs";
import GeneralSettings from "./pages/cart/Settings/Settings";
import TermsOfService from "./pages/cart/TermsOfService";
import AddNewProduct from "./admin/pages/products/product components/AddNewProduct";
import EditProduct from "./admin/pages/products/product components/EditProduct";
import Orders from "./pages/orders/Order";
import ProductDetail from "./components/products/ProductDetail";
import NewArrivals from "./pages/categories/NewArrivals";
import AuthLayout from "./pages/auth/AuthLayout";
import AdminLayout from "./pages/auth/AdminLayout";
import Dashboard from "./admin/pages/dashboard/Dashboard";
import Products from "./admin/pages/products/Products";
import Settings from "./admin/pages/settings/Settings";
import AdminOrders from "./admin/pages/orders/AdminOrders";
import SearchResults from "./components/products/SearchResults";
import ProductsPage from "./pages/filters/FilteredPages";
import Wishlist from "./pages/orders/Wishlist";
import Confirm from "./pages/orders/Confirm";
import Contact from "./pages/orders/Contact";
import SuggestedItemDetails from "./components/products/SuggestedItemsDetails";
import ScrollToTop from "./components/ScrollToTop";
import Producter from "./card/Ade";
import ProductCategory from "./pages/categories/ProductCategory";
import PrivateRoute from "./routing/PrivateRoute";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<Mainlayout />}>
        <Route path="/category/:id" element={<ProductCategory />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/product/item/:id" element={<ProductDetail />} />
        <Route path="/suggested/:id" element={<SuggestedItemDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/verify-reset-otp" element={<VerifyForgotPassword />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/filtered-products" element={<ProductsPage />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/ade" element={<Producter />} />
      </Route>

      {/* Protected routes */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<Mainlayout />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/general-settings" element={<GeneralSettings />} />
          <Route path="/orders/:id" element={<Confirm />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* AuthLayout Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
      
      {/* Admin routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="add-new-product" element={<AddNewProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all route - 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;