"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ZoomableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function ZoomableImage({ src, alt, width, height }: ZoomableImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const image = container.querySelector('img');
      const lens = container.querySelector('.zoom-lens');
      if (!image || !lens) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const lensWidth = (lens as HTMLElement).offsetWidth;
      const lensHeight = (lens as HTMLElement).offsetHeight;

      let lensX = x - lensWidth / 2;
      let lensY = y - lensHeight / 2;

      lensX = Math.max(0, Math.min(lensX, rect.width - lensWidth));
      lensY = Math.max(0, Math.min(lensY, rect.height - lensHeight));

      (lens as HTMLElement).style.left = `${lensX}px`;
      (lens as HTMLElement).style.top = `${lensY}px`;

      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;

      image.style.transformOrigin = `${bgX}% ${bgY}%`;
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [src]); // Add src as dependency to reinitialize zoom when image changes

  return (
    <div ref={containerRef} className="relative group">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-contain group-hover:scale-150 transition-transform duration-300"
        priority
      />
      <div className="zoom-lens absolute hidden group-hover:block w-40 h-40 bg-white bg-opacity-30 border-2 border-white pointer-events-none rounded-lg z-10" />
    </div>
  );
}