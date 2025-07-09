// src/hooks/useProducts.ts
"use client";

import { useEffect, useState } from 'react';
import { Product } from '@/data/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { products, loading };
}
