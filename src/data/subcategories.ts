// src/data/subcategories.ts

interface MongoSubCategoryDoc {
  _id: string;
  title?: string;
  slug?: string;
  category?: string;
  image?: string;
  description?: string;
  specifications?: string[];
}

export interface SubCategory {
  id: number;
  _id: string;
  title: string;
  slug: string;
  category: string; // This should match the parent category's title
  image?: string;
  description?: string;
  specifications?: string[];
}

export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  try {
    // During build time, fetch directly from database
    if (typeof window === 'undefined' && !global.fetch) {
      const { getDB } = await import('@/config/db');
      const db = getDB();
      const subcategories = await db.collection('subcategories').find({}).toArray();
      return subcategories.map(doc => ({
        id: parseInt(doc._id.toString().slice(-8), 16), // Convert ObjectId to number
        _id: doc._id.toString(),
        title: doc.title || '',
        slug: doc.slug || '',
        category: doc.category || '',
        image: doc.image,
        description: doc.description,
        specifications: doc.specifications
      }));
    }

    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.BASE_URL || 'http://localhost:3000';

    const url = new URL('/api/subcategories', baseUrl).toString();

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.map((doc: MongoSubCategoryDoc) => ({
      _id: doc._id.toString(),
      id: parseInt(doc._id.toString().slice(-8), 16),
      title: doc.title || '',
      slug: doc.slug || '',
      category: doc.category || '',
      image: doc.image,
      description: doc.description,
      specifications: doc.specifications
    }));
  } catch (error) {
    console.error("Error loading subcategories:", error);

    // Fallback to direct database access during build
    if (typeof window === 'undefined') {
      try {
        const { getDB } = await import('@/config/db');
        const db = getDB();
        const subcategories = await db.collection('subcategories').find({}).toArray();
        return subcategories.map(doc => ({
          id: parseInt(doc._id.toString().slice(-8), 16),
          _id: doc._id.toString(),
          title: doc.title || '',
          slug: doc.slug || '',
          category: doc.category || '',
          image: doc.image,
          description: doc.description,
          specifications: doc.specifications
        }));
      } catch (dbError) {
        console.error("Database fallback failed:", dbError);
        return [];
      }
    }

    return [];
  }
};

// Alternative with hardcoded URL (commented out)
// export const fetchSubCategories = async (): Promise<SubCategory[]> => {
//   const baseUrl = 'https://sk-equipments.netlify.app'; // Hardcoded BASE_URL
//   const res = await fetch(`${baseUrl}/api/subcategories`);
//   if (!res.ok) {
//     throw new Error(`Failed to fetch subcategories: ${res.status} ${res.statusText}`);
//   }
//   const data = await res.json();
//   return data;
// };

export const getSubCategoryBySlug = async (slug: string): Promise<SubCategory | undefined> => {
  const subCategories = await fetchSubCategories();
  return subCategories.find(subCat => subCat.slug === slug);
};

export const getSubCategoriesByCategory = async (categoryTitle: string): Promise<SubCategory[]> => {
  const subCategories = await fetchSubCategories();
  return subCategories.filter(subCat => subCat.category === categoryTitle);
};

export const getFeaturedSubCategories = async (count: number = 4): Promise<SubCategory[]> => {
  const subCategories = await fetchSubCategories();
  return subCategories.slice(0, count);
};

export const updateSubCategory = async (id: number, updatedSubCategory: Partial<SubCategory>): Promise<SubCategory | undefined> => {
  const subCategories = await fetchSubCategories();
  const index = subCategories.findIndex(subCat => subCat.id === id);
  if (index !== -1) {
    subCategories[index] = { ...subCategories[index], ...updatedSubCategory };
    return subCategories[index];
  }
  return undefined;
};