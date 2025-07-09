import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import ProductsSection from '@/components/sections/ProductsSection';
import PromoBannersSection from '@/components/sections/PromoBannersSection';
import BigSaleBanner from '@/components/sections/BigSaleBanner';
import FloatingChat from '@/components/FloatingChat'; // Corrected import path
import FeaturedProducts from '@/components/sections/FeaturedProducts';

export default function Home() { // Removed (Component, pageProps) as they're not needed for homepage
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <ProductsSection title="Best Selling Products" />
      <PromoBannersSection />
      <FeaturedProducts title="Featured Products" />
      <BigSaleBanner />
      <FloatingChat />
    </Layout>
  );
}