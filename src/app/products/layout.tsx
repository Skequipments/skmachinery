import { fetchProducts } from '@/data/products';

export async function generateStaticParams() {
  try {
    // Use direct database access during build
    const { getDB } = await import('@/config/db');
    const db = getDB();
    const products = await db.collection('products').find({}, { projection: { category: 1 } }).toArray();
    const categories = Array.from(new Set(products.map(product => product.category)));
    
    return categories.map(category => ({
      slug: category.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return []; // Return empty array if fetch fails
  }
}


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}