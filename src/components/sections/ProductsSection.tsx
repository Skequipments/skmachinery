"use client";
import React, { useEffect, useState } from 'react';
import ProductCard from '../product/ProductCard';
import { Product, fetchProducts } from '@/data/products';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductsSectionProps {
  title?: string;
  products?: Product[];
}

export function SkeletonCard() {
  return (
    <div className="px-2">
      <div className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-0">
          <Skeleton className="aspect-square w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-full mx-auto" />
            <Skeleton className="h-4 w-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSection({
  title = "Best Selling Products",
  products: propProducts
}: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!propProducts) {
      loadProducts();
    }
  }, [propProducts]);

  const productsToDisplay = (propProducts || products.filter(product => product.isBestSelling === true)).slice(0, 10);

  return (
    <section className="py-10">
      <div className="container-custom-2">
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            productsToDisplay.map((product) => (
              <div key={product._id} className="px-2">
                <ProductCard
                  _id={product._id}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating}
                  reviews={product.reviews}
                  category={product.category}
                  slug={product.slug}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
