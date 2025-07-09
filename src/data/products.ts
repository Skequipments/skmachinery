
// src/data/products.ts

interface MongoProductDoc {
  _id: string;
  title?: string;
  image?: string;
  additionalImages?: string[];
  price?: number;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  category?: string;
  slug?: string;
  description?: string;
  specifications?: string[];
  isBestSelling?: boolean;
  isFeatured?: boolean;
  subCategory?: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  id?: number;
  title: string;
  image: string;
  additionalImages?: string[];
  price?: number;
  originalPrice?: string;
  rating: number;
  reviews: number;
  category: string;
  slug: string;
  description?: string;
  specifications?: string[];
  isBestSelling?: boolean;
  isFeatured?: boolean;
  subCategory?: string;
  createdAt?: string;
}


export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // During build time, fetch directly from database
    if (typeof window === 'undefined' && !global.fetch) {
      const { ProductService } = await import('@/services/productService');
      return await ProductService.getAllProducts();
    }

    // Use dynamic base URL for runtime
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/products?includeDescription=true`);

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (process.env.NODE_ENV === 'development') {
      console.log(`Loaded ${data.length} products`);
    }

    return data;
  } catch (error) {
    console.error("Error loading products:", error);

    // Fallback to direct database access during build
    if (typeof window === 'undefined') {
      try {
        const { ProductService } = await import('@/services/productService');
        return await ProductService.getAllProducts();
      } catch (dbError) {
        console.error("Database fallback failed:", dbError);
        return [];
      }
    }

    return [];
  }
};


export async function getProductBySlug(slug: string) {
  try {
    const normalizedSlug = slug.toLowerCase();

    // Use the same URL construction as fetchProducts
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/products?includeDescription=true`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.warn(`Failed to fetch products: ${response.status} ${response.statusText}`);
      return null;
    }

    const products = await response.json();

    if (!Array.isArray(products)) {
      console.warn('Invalid products response');
      return null;
    }

    // Find product with multiple matching strategies - optimized
    const product = products.find((product: Product) => {
      // Quick exact match first
      if (product.slug && product.slug.toLowerCase() === normalizedSlug) {
        return true;
      }

      // Then check generated slug
      const productSlug = (product.slug || product.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      if (productSlug === normalizedSlug) {
        return true;
      }

      // Finally check title slug
      const titleSlug = product.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return titleSlug === normalizedSlug;
    });

    if (!product) {
      console.log(`Product not found for slug: ${slug}`);
      return null;
    }

    return product;

  } catch (error) {
    console.warn('Error fetching product by slug:', error);
    return null;
  }
}




export const getFeaturedProducts = async (count: number = 4): Promise<Product[]> => {
  const products = await fetchProducts();
  return products.slice(0, count);
};

export const updateProduct = async (id: number, updatedProduct: Partial<Product>): Promise<Product | undefined> => {
  const products = await fetchProducts();
  const index = products.findIndex(product => product.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    return products[index];
  }
  return undefined;
};


export const generateStaticParams = async () => {
  const products = await fetchProducts();
  const categories = Array.from(new Set(products.map(product => product.category))); 

  return categories.map(category => ({
    slug: category.toLowerCase().replace(/\s+/g, '-') 
  }));
};
