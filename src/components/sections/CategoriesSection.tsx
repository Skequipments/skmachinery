"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategories } from "@/data/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  _id: string;
  title: string;
  image: string;
}

interface CategoryCardProps {
  image: string;
  title: string;
}

function CategoryCard({ image, title }: CategoryCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      className="px-2"
    >
      <Card className="overflow-hidden group h-full">
        <Link href={`/category/${title.toLowerCase().replace(/\s+/g, "-")}`} className="block relative h-full">
          <CardContent className="p-0 relative h-full">
            <div className="aspect-square relative">
              <Image
                src={image}
                alt={title}
                fill
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
              <div className="w-full bg-black bg-opacity-50 text-white p-3">
                <h3 className="text-center font-medium">{title}</h3>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}

function SkeletonCategoryCard() {
  return (
    <div className="px-2">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Skeleton className="aspect-square w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const nextSlide = () => {
    if (categories.length <= 5) return;
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(categories.length / 5));
  };

  const prevSlide = () => {
    if (categories.length <= 5) return;
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(categories.length / 5)) % Math.ceil(categories.length / 5));
  };

  const visibleCategories = categories.length > 5 
    ? categories.slice(currentSlide * 5, (currentSlide + 1) * 5)
    : categories;

  return (
    <section className="py-10 bg-white relative">
      <div className="container-custom-2 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Best Selling Categories</h2>

        {/* Carousel Container */}
        <div className="relative">
          {categories.length > 5 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Previous categories"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Next categories"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}

          <div ref={carouselRef} className="overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6"
              >
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonCategoryCard key={index} />
                    ))
                  : visibleCategories.map((category) => (
                      <CategoryCard 
                        key={category._id} 
                        title={category.title} 
                        image={category.image} 
                      />
                    ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Indicators */}
        {categories.length > 5 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(categories.length / 5) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-primary' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}