import React from 'react';
import { Suspense } from 'react';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getProductBySlug, fetchProducts, Product } from '@/data/products';
import { notFound } from 'next/navigation';
import ReletedProductsSection from '@/components/sections/ReletedProductsSection';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductLoading from './loading';

// Add this before the ProductDetailPage component
export async function generateStaticParams() {
  try {
    // Use direct database access during build
    const { getDB } = await import('@/config/db');
    const db = getDB();
    const products = await db.collection('products').find({}, { projection: { slug: 1, title: 1 } }).toArray();

    return products.map((product) => ({
      slug: (product.slug || product.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // More thorough slug generation
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Main product content component
async function ProductContent({ slug }: { slug: string }) {
  try {
    const normalizedSlug = decodeURIComponent(slug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const product = await getProductBySlug(normalizedSlug);

    if (!product) {
      return notFound();
    }

    // Debug product data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Product page data:', {
        title: product.title,
        hasDescription: !!product.description,
        descriptionLength: product.description?.length || 0,
        hasSpecifications: !!product.specifications && product.specifications.length > 0,
        specificationsCount: product.specifications?.length || 0,
        hasAdditionalImages: !!product.additionalImages && product.additionalImages.length > 0,
        additionalImagesCount: product.additionalImages?.length || 0,
        allKeys: Object.keys(product)
      });
    }

    return (
      <>
        <section className="py-10">
          <div className="container-custom">
            {/* Breadcrumbs */}
            <Breadcrumbs 
              items={[
                { label: 'Products', href: '/products' },
                { label: product.title }
              ]} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images Section */}
              <div className="relative">
                <ProductImageGallery 
                  images={[product.image, ...(product.additionalImages || [])]} 
                  title={product.title}
                />
              </div>
              {/* Product Info - Scrollable Content */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>

                {/* Ratings */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} Reviews)</span>
                </div>

                {/* Description */}
                {product.description ? (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Description:</h3>
                    <div 
                      className="prose max-w-none text-gray-600 
                        [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900
                        [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:text-gray-800
                        [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mb-3 [&>h3]:text-gray-800
                        [&>h4]:text-lg [&>h4]:font-medium [&>h4]:mb-2 [&>h4]:text-gray-700
                        [&>h5]:text-base [&>h5]:font-medium [&>h5]:mb-2 [&>h5]:text-gray-700
                        [&>h6]:text-sm [&>h6]:font-medium [&>h6]:mb-2 [&>h6]:text-gray-600
                        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                        [&>p]:mb-4 [&>p]:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Description:</h3>
                    <p className="text-gray-600">No description available for this product.</p>
                  </div>
                )}

                {/* Specifications */}
                {(product?.specifications ?? []).length > 0 && (
                  <div className="border-t border-b py-4 mb-6">
                    <h3 className="font-medium mb-2">Specifications:</h3>
                    <ul className="space-y-1">
                      {(product?.specifications ?? []).map((spec: string, idx: number) => (
                        <li key={idx} className="text-gray-600">• {spec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* WhatsApp Button */}
                <div className="flex items-center mb-6">
                  <WhatsAppButton product={{ ...product, price: Number(product.price) }} />
                </div>

                {/* Category and Tags */}
                <div className="space-y-2 text-sm text-gray-500">
                  <p>
                    Category:{" "}
                    <span className="text-[hsl(var(--bonik-pink))]">{product.category}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products - Load separately to avoid blocking main content */}
        <Suspense fallback={<div className="py-10"><div className="container-custom"><div className="text-center">Loading related products...</div></div></div>}>
          <RelatedProductsWrapper productId={product._id} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    return notFound();
  }
}

// Separate component for related products to avoid blocking main content
async function RelatedProductsWrapper({ productId }: { productId: string }) {
  try {
    const relatedProducts = await fetchProducts();

    return (
      <ReletedProductsSection
        title="You Might Also Like"
        products={relatedProducts
          .filter((p: Product) => p._id !== productId)
          .slice(0, 50)}
      />
    );
  } catch (error) {
    console.error('Error loading related products:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;

  if (!resolvedParams?.slug) {
    return notFound();
  }

  return (
    <Layout>
      <Suspense fallback={<ProductLoading />}>
        <ProductContent slug={resolvedParams.slug} />
      </Suspense>
    </Layout>
  );
}

export async function generateMetadata({ 
  params 
}: ProductDetailPageProps) {
  const resolvedParams = await params;

  return {
    title: `Product ${resolvedParams.slug}`,
  };
}

// Add Breadcrumbs component
function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            {item.href ? (
              <Link 
                href={item.href}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 text-sm font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

