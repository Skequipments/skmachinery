
export const APP_CONFIG = {
  name: 'SK Equipments',
  description: 'Your trusted partner for quality equipment',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: '/api',
  imageUrl: '/api/images'
};

export const ROUTES = {
  home: '/',
  products: '/products',
  categories: '/categories',
  about: '/about-us',
  contact: '/contact-us',
  admin: '/admin'
};
