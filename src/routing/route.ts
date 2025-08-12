// routes.js
export const routes = [
  // Public routes (MainLayout)
  { path: '/', name: 'Home' },
  { path: '/category/:id', name: 'Category' },
  { path: '/product/item/:id', name: 'Product Details' },
  { path: '/suggested/:id', name: 'Suggested Item' },
  { path: '/search', name: 'Search Results' },
  { path: '/new-arrivals', name: 'New Arrivals' },
  { path: '/filtered-products', name: 'Filtered Products' },
  { path: '/faqs', name: 'FAQs' },
  { path: '/terms-of-service', name: 'Terms of Service' },
  { path: '/contact-us', name: 'Contact Us' },

  // Protected routes (MainLayout)
  { path: '/cart', name: 'Shopping Cart' },
  { path: '/orders', name: 'My Orders' },
  { path: '/orders/:id', name: 'Order Details' },
  { path: '/confirm-order', name: 'Confirm Order' },
  { path: '/general-settings', name: 'Account Settings' },
  { path: '/wishlist', name: 'Wishlist' },



];