
import { fetchProducts } from '@/data/products';
import { fetchSubCategories } from '@/data/subcategories';

export async function generateStaticParams() {
  try {
    const [products, subcategories] = await Promise.all([
      fetchProducts(),
      fetchSubCategories()
    ]);

    const params = [];

    // Generate paths for categories only (not subcategories since this is [slug] not [...slug])
    const categories = Array.from(new Set(products.map(product => product.category)));
    for (const category of categories) {
      params.push({
        slug: category.toLowerCase().replace(/\s+/g, '-')
      });
    }

    return params;
  } catch (error) {
    console.error('Failed to fetch data for static params:', error);
    return [];
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
