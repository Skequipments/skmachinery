import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/data/products";

export default function ProductCard({
  title,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  category,
  slug,
}: Product) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use traditional Image constructor to load the image
    const img = new window.Image(); // Use window.Image
    img.src = image;
    img.onload = () => setLoading(false); // Set loading to false once image is loaded
  }, [image]);

  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const productSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const productUrl = `/product/${productSlug}`;
    router.push(productUrl);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow duration-300">
      <div className="relative group">
        <Link 
          href={`/product/${(slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
          onClick={handleProductClick}
        >
          <div className="overflow-hidden bg-white">
            {loading ? (
              <div className="w-full h-[220px] flex items-center justify-center bg-gray-200 animate-pulse">
                <Skeleton className="h-[220px] w-[250px] " />
              </div>
            ) : (
              <Image
                src={image}
                alt={title}
                width={300}
                height={300}
                className="w-full h-[220px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        </Link>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
          <Link 
            href={`/product/${(slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
            onClick={handleProductClick}
          >
            <Button
              size="sm"
              className="bg-[hsl(var(--bonik-blue))/90] hover:bg-[hsl(var(--bonik-blue))/90] text-white border-none shadow-none"
            >
              <ShoppingCart size={16} className="mr-2" />
              Quick View
            </Button>
          </Link>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Link
          href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-sm text-gray-500 mb-1 hover:text-[hsl(var(--bonik-blue))] transition-colors"
        >
          {loading ? (
            <Skeleton className="h-4 w-[150px]" />
          ) : (
            category
          )}
        </Link>
        <Link href={`/product/${slug.toLowerCase().replace(/\s+/g, '-')}`} className="block">
          <h3 className="font-medium text-gray-800 hover:text-[hsl(var(--bonik-pink))] transition-colors line-clamp-2 mb-2">
            {loading ? <Skeleton className="h-6 w-[200px]" /> : title}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          {loading ? (
            <div className="space-x-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-4 h-4 " />
              ))}
            </div>
          ) : (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))
          )}
          <span className="text-sm text-gray-500 ml-1">
            {loading ? <Skeleton className="h-4 w-[40px]" /> : `(${reviews})`}
          </span>
        </div>
        <div className="mt-auto">
          {/* Price and add-to-cart button can be added in a similar way */}
        </div>
      </CardContent>
    </Card>
  );
}
