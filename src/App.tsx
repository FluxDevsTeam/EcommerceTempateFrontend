import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./pages/auth/AuthContext";
import MainLayout from "./pages/auth/Mainlayout";
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
import GeneralSettings from "./pages/cart/Settings";
import TermsOfService from "./pages/cart/TermsOfService";
import AddNewProduct from "./admin/pages/products/product components/AddNewProduct";
import EditProduct from "./admin/pages/products/product components/EditProduct";
import Orders from "./pages/orders/Order";
import ProductDetail from "./components/products/ProductDetail";
import Categories from "./pages/categories/Categories";
import AuthLayout from "./pages/auth/AuthLayout";
import AdminLayout from "./pages/auth/AdminLayout";
import Dashboard from "./admin/pages/dashboard/Dashboard";
import Products from "./admin/pages/products/Products";
import Settings from "./admin/pages/settings/Settings";
import AdminOrders from "./admin/pages/orders/AdminOrders";
import SearchResults from "./components/products/SearchResults";
import ShoeCategory from "./pages/categories/ShoeCategory";
import ClothesCategory from "./pages/categories/ClothesCategory";
import AccessoriesCategory from "./pages/categories/AccessoriesCategory";
import ProductsPage from "./pages/filters/FilteredPages";


const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* Move AuthProvider here */}
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  </QueryClientProvider>
  );
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/product/item/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="//verify-reset-otp" element={<VerifyForgotPassword/>} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/shoe-category" element={<ShoeCategory />} />
        <Route path="/clothes-category" element={<ClothesCategory />} />
        <Route path="/accessories-category" element={<AccessoriesCategory />} />
        <Route path="/filtered-products" element={<ProductsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/settings" element={<GeneralSettings />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/orders" element={<Orders />} />
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
