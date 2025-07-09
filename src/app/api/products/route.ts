import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';
import { connectToDatabase } from '@/utils/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '1000'); // Increase default limit
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Only fetch essential fields to reduce response size
    const includeDescription = url.searchParams.get('includeDescription') === 'true';

    // Always include core fields, conditionally include description and specifications
    const projection: Record<string, number> = {
      title: 1,
      slug: 1,
      image: 1,
      category: 1,
      rating: 1,
      reviews: 1,
      price: 1,
      originalPrice: 1,
      isBestSelling: 1,
      isFeatured: 1,
      subCategory: 1,
      additionalImages: 1
    };

    if (includeDescription) {
      projection.description = 1;
      projection.specifications = 1;
    }

    // Debug: Log projection in development
    if (process.env.NODE_ENV === 'development' && includeDescription) {
      console.log('Including description and specifications in response');
    }

    // Get all products with better error handling
    const products = await productsCollection
      .find({})
      .project(projection)
      .sort({ createdAt: -1, _id: 1 }) // Sort by creation date, then by ID for consistency
      .skip(skip)
      .limit(Math.min(limit, 1000)) // Cap at 1000 for performance
      .toArray();

    const total = await productsCollection.countDocuments();

    // Debug: Log categories in returned products
    if (process.env.NODE_ENV === 'development') {
      const categoriesInProducts = [...new Set(products.map(p => p.category))];
      console.log('Categories in API response:', categoriesInProducts);
      console.log(`Returning ${products.length} products out of ${total} total`);

      // Log category distribution
      const categoryCount = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});
      console.log('Category distribution:', categoryCount);

      // Check if we're missing products
      if (products.length < total) {
        console.warn(`WARNING: Only returning ${products.length} products out of ${total} total products in database!`);

        // Get a sample of all categories in the database
        const allCategoriesInDB = await productsCollection.distinct('category');
        console.log('All categories in database:', allCategoriesInDB);
      }
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Add caching configuration
export const revalidate = 3600; // Revalidate every hour

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    const newProduct = await ProductService.createProduct(productData);
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const productData = await request.json();
    const updatedProduct = await ProductService.updateProduct(productData);
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const result = await ProductService.deleteProduct(id);
    if (!result) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}