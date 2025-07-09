// components/product/ProductImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import ZoomableImage from './ZoomableImage';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="md:sticky md:top-24 bg-white p-8 rounded-lg flex flex-col gap-4 border">
      {/* Main Image with Zoom */}
      <div className="relative overflow-hidden group  rounded-lg">
        <ZoomableImage
          src={mainImage}
          alt={title}
          width={400}
          height={400}
        />
        <div className="absolute hidden group-hover:block w-40 h-40 bg-white bg-opacity-30 border-2 border-white pointer-events-none rounded-lg z-10"></div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <div
              key={index}
              className={`w-20 h-20 rounded-md cursor-pointer border-2 ${
                mainImage === img ? 'border-black' : 'border-2'
              }`}
              onClick={() => setMainImage(img)}
            >
              <Image
                src={img}
                alt={`${title} - ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-md "
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}