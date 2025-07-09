// src/data/Categories.ts

interface MongoCategoryDoc {
  _id: string;
  title?: string;
  image?: string;
  category?: string;
  slug?: string;
  description?: string;
}

export interface Category {
    _id: string;
    title: string;
    image: string;
    category?: string;
    slug: string;
    description?: string;
  }


  export const fetchCategories = async (): Promise<Category[]> => {
    try {
      // During build time, fetch directly from database
      if (typeof window === 'undefined' && !global.fetch) {
        const { getDB } = await import('@/config/db');
        const db = getDB();
        const categories = await db.collection('categories').find({}).toArray();
        return categories.map(doc => ({
          _id: doc._id.toString(),
          title: doc.title || '',
          image: doc.image || '',
          category: doc.category,
          slug: doc.slug || '',
          description: doc.description
        }));
      }

      // Use dynamic base URL for runtime
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.BASE_URL || 'http://localhost:3000';

      const res = await fetch(`${baseUrl}/api/categories`);

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Loaded ${data.length} categories`);
      }
      
      return data;
    } catch (error) {
      console.error("Error loading categories:", error);
      
      // Fallback to direct database access during build
      if (typeof window === 'undefined') {
        try {
          const { getDB } = await import('@/config/db');
          const db = getDB();
          const categories = await db.collection('categories').find({}).toArray();
          return categories.map(doc => ({
            _id: doc._id.toString(),
            title: doc.title || '',
            image: doc.image || '',
            category: doc.category,
            slug: doc.slug || '',
            description: doc.description
          }));
        } catch (dbError) {
          console.error("Database fallback failed:", dbError);
          return [];
        }
      }
      
      return [];
    }
  };
//
  // export const fetchCategories = async (): Promise<Category[]> => {
  //   const baseUrl = 'https://sk-equipments.netlify.app'; // Hardcoded BASE_URL

  //   const res = await fetch(`${baseUrl}/api/categories`);
  //   if (!res.ok) {
  //     throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
  //   }

  //   const data = await res.json();
  //   return data;
  // };


  export const getProductBySlug = async (slug: string): Promise<Category | undefined> => {
    const Categories = await fetchCategories();
    return Categories.find(product => product.slug === slug);
  };

  export const getFeaturedCategories = async (count: number = 4): Promise<Category[]> => {
    const Categories = await fetchCategories();
    return Categories.slice(0, count);
  };

  export const updateProduct = async (id: string, updatedProduct: Partial<Category>): Promise<Category | undefined> => {
    const Categories = await fetchCategories();
    const index = Categories.findIndex(product => product._id === id);
    if (index !== -1) {
      Categories[index] = { ...Categories[index], ...updatedProduct };
      return Categories[index];
    }
    return undefined;
  };