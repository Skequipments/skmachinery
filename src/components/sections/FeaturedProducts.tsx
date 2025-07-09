"use client";
import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../product/ProductCard";
import { Product, fetchProducts } from "@/data/products";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeaturedProductsProps {
  title?: string;
  products?: Product[];
}

export function SkeletonCard() {
  return (
    <div className="px-2">
      <div className="overflow-hidden">
        <div className="p-0">
          <Skeleton className="aspect-square w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts({
  title = "Best Selling Products",
  products: propProducts,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [slidesToShow, setSlidesToShow] = useState(5);

  const productsToDisplay = propProducts || products.filter((product) => product.isFeatured);
  const totalProducts = productsToDisplay.length;

  const getVisibleProducts = () => {
    if (!productsToDisplay || productsToDisplay.length === 0) {
      return [];
    }

    const wrappedIndex = ((currentIndex % totalProducts) + totalProducts) % totalProducts;
    const items = [];
    
    for (let i = 0; i < slidesToShow; i++) {
      const index = (wrappedIndex + i) % totalProducts;
      const product = productsToDisplay[index];
      if (product) {
        items.push(product);
      }
    }
    
    return items;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalProducts);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => ((prev - 1 + totalProducts) % totalProducts));
  };

  // Update the auto-play effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (autoPlay && totalProducts > slidesToShow) {
      intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalProducts);
      }, 3000); 
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoPlay, totalProducts, slidesToShow]);

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(5);
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

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

    // Only fetch if propProducts not provided
    if (!propProducts) {
      loadProducts();
    }
  }, [propProducts]);

  const visibleProducts = productsToDisplay.slice(
    currentIndex * slidesToShow,
    (currentIndex + 1) * slidesToShow
  );

  return (
    <section className="py-10 relative">
      <div className="container-custom-2">
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
        
        {/* Carousel Container */}
        <div className="relative">
          {productsToDisplay.length > slidesToShow && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Previous products"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Next products"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}

          <div 
            ref={carouselRef} 
            className="overflow-hidden"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: currentIndex > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentIndex > 0 ? -100 : 100 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6"
              >
                {loading ? (
                  Array.from({ length: slidesToShow }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                ) : (
                  getVisibleProducts().map((product, index) => (
                    product && (  // Add this check
                      <motion.div
                        key={`${product._id || index}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="px-2"
                      >
                        <ProductCard
                          _id={product._id || ''}
                          title={product.title || ''}
                          image={product.image || ''}
                          price={product.price || 0}
                          originalPrice={product.originalPrice ? String(product.originalPrice) : undefined}
                          rating={product.rating || 0}
                          reviews={product.reviews || 0}
                          category={product.category || ''}
                          slug={product.slug || ''}
                        />
                      </motion.div>
                    )
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Indicators */}
        {/* {productsToDisplay.length > slidesToShow && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalProducts }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </div>
    </section>
  );
}