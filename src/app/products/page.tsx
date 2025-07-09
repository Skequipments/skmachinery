"use client";

import { useEffect, useState } from 'react';
import { Product, fetchProducts } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 240000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 12;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
    
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Extract all unique categories from products
  const allCategories = Array.from(new Set(products.map(product => product.category)));

  // Filter products based on all criteria
  const filteredProducts = products.filter(product => {
    // Category filter
    const categoryMatch = selectedCategories.length === 0 || 
                         selectedCategories.includes(product.category);
    
    // Price filter
  
    const priceValue: string | number | undefined = product.price;
    let price: number = 0;

    if (typeof priceValue === 'string') {
      price = parseFloat((priceValue as string).replace(/,/g, ''));
    } else if (typeof priceValue === 'number') {
      price = priceValue;
    } else {
      price = 0;
    }

    
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    
    // Rating filter
    const ratingMatch = product.rating >= minRating;
    
    // Search filter
    const searchMatch = searchQuery === '' || 
                       product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && priceMatch && ratingMatch && searchMatch;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(pageNumber);
  };

  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  // Handle price range change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    setPriceRange(prev => 
      index === 0 ? [newValue, prev[1]] : [prev[0], newValue]
    );
    setCurrentPage(1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're at the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // First page and ellipsis
    if (startPage > 1) {
      pages.push(
        <motion.button
          key={1}
          onClick={() => paginate(1)}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          1
        </motion.button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <motion.button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {i}
        </motion.button>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <motion.button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {totalPages}
        </motion.button>
      );
    }

    return (
      <motion.div 
        className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-600 text-sm">
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
        </p>
        
        <div className="flex items-center gap-2">
          <motion.button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>
          
          <div className="flex gap-1">
            {pages}
          </div>
          
          <motion.button 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#f6f9fc]"
      >
        <div className="container-2 mx-auto px-4 py-8 sm:px-20 sm:py-10">
          <motion.div 
            className="flex flex-col md:flex-row gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Sidebar Filters */}
            <motion.div 
              className="w-full md:w-1/4 space-y-6"
              variants={itemVariants}
            >
              {/* Search Filter */}
              <motion.div 
                className="bg-white p-4 rounded-lg shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-lg font-semibold mb-4">Search</h2>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-2 border rounded"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </motion.div>

              {/* Categories Filter */}
              <motion.div 
                className="bg-white p-4 rounded-lg shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <ul className="space-y-2">
                  {allCategories.map((category, idx) => (
                    <motion.li key={idx} whileHover={{ x: 5 }}>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded text-blue-500"
                        />
                        <span>{category}</span>
                      </label>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Ratings Filter */}
              <motion.div 
                className="bg-white p-4 rounded-lg shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-lg font-semibold mb-4">Ratings</h2>
                <ul className="space-y-2">
                  {[4, 3, 2, 1, 0].map(rating => (
                    <motion.li key={rating} whileTap={{ scale: 0.95 }}>
                      <button 
                        onClick={() => {
                          setMinRating(rating);
                          setCurrentPage(1);
                        }}
                        className={`flex items-center w-full text-left p-1 rounded ${minRating === rating ? 'bg-blue-100' : ''}`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        {rating > 0 && <span className="ml-1 text-sm">& up</span>}
                        {rating === 0 && <span className="ml-1 text-sm">Any rating</span>}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              className="w-full md:w-3/4"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-6">
                <motion.h1 
                  className="text-2xl font-bold"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                >
                  All Products
                </motion.h1>
                <motion.p 
                  className="text-gray-600"
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                >
                  {filteredProducts.length} products found
                </motion.p>
              </div>

              {/* Sorting Options */}
              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.button 
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Best Selling
                </motion.button>
                <motion.button 
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Newest
                </motion.button>
              </motion.div>

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentProducts.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  layout
                >
                  <AnimatePresence>
                    {currentProducts.map((product) => (
                      <motion.div 
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ 
                          duration: 0.3,
                          layout: {
                            type: "spring",
                            stiffness: 100,
                            damping: 20
                          }
                        }}
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        className="bg-white rounded-lg shadow overflow-hidden"
                      >
                        <Link href={`/product/${product.slug.toLowerCase().replace(/\s+/g, '-')}`}>
                          <div className="relative aspect-square">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover"
                              priority
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-gray-600 text-sm ml-1">({product.reviews})</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div 
                  className="bg-white rounded-lg shadow p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                  <motion.button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange([0, 240000]);
                      setMinRating(0);
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset Filters
                  </motion.button>
                </motion.div>
              )}

              {/* Pagination */}
              {renderPagination()}
            </motion.div>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </>
  );
}