import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';
import ForgottenPassword from './pages/auth/ForgottenPassword';
import { Navigate } from 'react-router-dom';

import Cart from './pages/cart/Cart';
import ConfirmOrder from './pages/cart/ConfirmOrder';
import FAQs from './pages/cart/FAQs';
import Settings from './pages/cart/Settings';
import TermsOfService from './pages/cart/TermsOfService';

import Orders from './pages/orders/Order';
import ProductDetail from './components/ProductDetail';

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
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgotten-password" element={<ForgottenPassword />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
{/* d */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/confirm-order" element={<ConfirmOrder />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />

                    <Route path="/orders" element={<Orders />} />
                    
                    {/* Catch all route - 404 */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
