
import { getDB } from '@/config/db';
import { ObjectId } from 'mongodb';

// Define the actual Product interface that matches your MongoDB documents
interface Product {
  _id: string;
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
}

export const ProductService = {
  async getAllProducts(): Promise<Product[]> {
    const db = getDB();
    const products = await db.collection('products').find({}).toArray();
    
    // Convert MongoDB documents to Product objects
    return products.map(doc => ({
      _id: doc._id.toString(),
      title: doc.title || '',
      image: doc.image || '',
      additionalImages: doc.additionalImages || [],
      price: doc.price,
      originalPrice: doc.originalPrice,
      rating: doc.rating || 0,
      reviews: doc.reviews || 0,
      category: doc.category || '',
      slug: doc.slug || '',
      description: doc.description,
      specifications: doc.specifications || [],
      isBestSelling: doc.isBestSelling || false,
      isFeatured: doc.isFeatured || false,
      subCategory: doc.subCategory
    }));
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const db = getDB();
    const doc = await db.collection('products').findOne({ slug });
    
    if (!doc) return null;
    
    return {
      _id: doc._id.toString(),
      title: doc.title || '',
      image: doc.image || '',
      additionalImages: doc.additionalImages || [],
      price: doc.price,
      originalPrice: doc.originalPrice,
      rating: doc.rating || 0,
      reviews: doc.reviews || 0,
      category: doc.category || '',
      slug: doc.slug || '',
      description: doc.description,
      specifications: doc.specifications || [],
      isBestSelling: doc.isBestSelling || false,
      isFeatured: doc.isFeatured || false,
      subCategory: doc.subCategory
    };
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const db = getDB();

    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = productData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || '';
    }

    // Remove _id from productData since MongoDB will generate it
    const { _id, ...dataToInsert } = productData;

    const result = await db.collection('products').insertOne(dataToInsert);

    if (!result.insertedId) {
      throw new Error('Failed to insert product');
    }

    const doc = await db.collection('products').findOne({ _id: result.insertedId });
    
    if (!doc) {
      throw new Error('Failed to retrieve created product');
    }

    return {
      _id: doc._id.toString(),
      title: doc.title || '',
      image: doc.image || '',
      additionalImages: doc.additionalImages || [],
      price: doc.price,
      originalPrice: doc.originalPrice,
      rating: doc.rating || 0,
      reviews: doc.reviews || 0,
      category: doc.category || '',
      slug: doc.slug || '',
      description: doc.description,
      specifications: doc.specifications || [],
      isBestSelling: doc.isBestSelling || false,
      isFeatured: doc.isFeatured || false,
      subCategory: doc.subCategory
    };
  },

  async updateProduct(productData: Partial<Product>): Promise<Product | null> {
    const db = getDB();

    if (!productData._id) {
      throw new Error('Product ID is required for update');
    }

    const { _id, ...updateData } = productData;
    const objectId = new ObjectId(_id);

    //Ensure description is included in the update
    console.log('Updating product with data:', {
      title: updateData.title,
      hasDescription: !!updateData.description,
      descriptionLength: updateData.description?.length || 0
    });

    const result = await db.collection('products').findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return {
      _id: result._id.toString(),
      title: result.title || '',
      image: result.image || '',
      additionalImages: result.additionalImages || [],
      price: result.price,
      originalPrice: result.originalPrice,
      rating: result.rating || 0,
      reviews: result.reviews || 0,
      category: result.category || '',
      slug: result.slug || '',
      description: result.description,
      specifications: result.specifications || [],
      isBestSelling: result.isBestSelling || false,
      isFeatured: result.isFeatured || false,
      subCategory: result.subCategory
    };
  },

  async deleteProduct(id: string): Promise<boolean> {
    const db = getDB();

    if (!id) {
      throw new Error('Product ID is required for deletion');
    }

    const objectId = new ObjectId(id);
    const result = await db.collection('products').deleteOne({ _id: objectId });

    return result.deletedCount > 0;
  }
};