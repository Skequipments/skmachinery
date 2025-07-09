"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { fetchProducts, Product } from '@/data/products';
import { fetchSubCategories, SubCategory as ImportedSubCategory } from '@/data/subcategories';
import { fetchCategories } from '@/data/categories';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Category {
  _id: string;
  title: string;
  image: string;
  slug: string;
  description?: string;
}

function CategoryPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const searchParams = useSearchParams();
  const subcategoryParam = searchParams.get('subcategory');
  const [categorySlug, setCategorySlug] = useState<string>('');

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 240000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const productsPerPage = 9;

  // Loading states
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<ImportedSubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Decode category name from slug
  const categoryName = decodeURIComponent(categorySlug).replace(/-/g, ' ');

  // Resolve params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCategorySlug(resolvedParams.slug || '');
    };
    resolveParams();
  }, [params]);

  // Group subcategories by category
  const subcategoriesByCategory = useMemo(() => {
    return subcategories.reduce<Record<string, ImportedSubCategory[]>>((acc, subcat) => {
      if (!acc[subcat.category]) {
        acc[subcat.category] = [];
      }
      acc[subcat.category].push(subcat);
      return acc;
    }, {});
  }, [subcategories]);

  // Add this helper function
  const isSubcategorySelected = (subcategorySlug: string) => {
    return selectedSubcategory === subcategorySlug || 
      subcategoryParam === subcategorySlug;
  };

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingProducts(true);
        setLoadingCategories(true);
        setLoadingSubcategories(true);

        const [productsData, categoriesData, subcategoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchSubCategories()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);

        // Handle subcategory from URL
        if (subcategoryParam) {
          const subcategory = subcategoriesData.find(sub => sub.slug === subcategoryParam);
          if (subcategory) {
            // Set selected subcategory
            setSelectedSubcategory(subcategoryParam);
            // Expand parent category
            setExpandedCategories(prev => ({
              ...prev,
              [subcategory.category]: true
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoadingProducts(false);
        setLoadingCategories(false);
        setLoadingSubcategories(false);
      }
    };

    loadData();
  }, [categorySlug, subcategoryParam]);

  // Sync subcategory selection with URL
  useEffect(() => {
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    } else {
      setSelectedSubcategory(null);
    }
  }, [subcategoryParam]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Normalize category names for comparison
      const productCategoryNormalized = product.category.toLowerCase().trim();
      const currentCategoryNormalized = categoryName.toLowerCase().trim();

      // Match parent category
      const categoryMatch = productCategoryNormalized === currentCategoryNormalized;

      // Match subcategory if selected
      const subcategoryMatch = selectedSubcategory 
        ? (product.subCategory && subcategories.some(subcat => 
            subcat.slug === selectedSubcategory && 
            subcat.title.toLowerCase() === product.subCategory!.toLowerCase()
          ))
        : true;

      // Other filters
      const ratingMatch = product.rating >= minRating;
      const searchMatch = searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && subcategoryMatch && ratingMatch && searchMatch;
    });
  }, [products, categoryName, selectedSubcategory, minRating, searchQuery, subcategories]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(pageNumber);
  };

  // Handle subcategory selection
  const handleSubcategoryClick = (subcat: ImportedSubCategory) => {
    const newSubcategory = selectedSubcategory === subcat.slug ? null : subcat.slug;

    // Get the parent category slug in kebab case format
    const parentCategorySlug = subcat.category.toLowerCase().replace(/\s+/g, '-');

    // Update URL with subcategory while maintaining parent category
    if (newSubcategory) {
      router.push(
        `/category/${parentCategorySlug}?subcategory=${newSubcategory}`
      );
    } else {
      router.push(`/category/${parentCategorySlug}`);
    }

    // Update state
    setSelectedSubcategory(newSubcategory);
    setExpandedCategories(prev => ({
      ...prev,
      [subcat.category]: true
    }));
    setCurrentPage(1);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle category navigation
  const handleCategoryClick = (categorySlug: string) => {
    setSelectedSubcategory(null);
    router.push(`/category/${categorySlug}`);
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

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

  const router = useRouter();
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
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {/* Sidebar Filters */}
            <motion.div
              className="w-full md:w-1/4 space-y-6"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5
                  }
                }
              }}
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
                {loadingCategories ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, index) => (
                      <Skeleton key={index} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {categories.map((category) => {
                      const hasSubcategories = subcategoriesByCategory[category.title]?.length > 0;
                      const isExpanded = expandedCategories[category.title] || false;
                      const isActive = categoryName.toLowerCase() === category.title.toLowerCase();

                      return (
                        <motion.li
                          key={category._id}
                          className="space-y-1 border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                              className={`block p-2 rounded flex-1 ${
                                isActive 
                                  ? 'text-blue-600 font-medium ' 
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleCategoryClick(category.title.toLowerCase().replace(/\s+/g, '-'));
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {/* {category.image && (
                                  <Image
                                    src={category.image}
                                    alt={category.title}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                  />
                                )} */}
                                <span>{category.title}</span>
                              </div>
                            </Link>

                            {hasSubcategories && (
                              <button
                                onClick={() => toggleCategoryExpansion(category.title)}
                                className="p-2 rounded hover:bg-gray-100 "
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>

                          <AnimatePresence>
                            {hasSubcategories && isExpanded && (
                              <motion.ul
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-4 space-y-1"
                              >
                                {subcategoriesByCategory[category.title]?.map((subcat) => (
                                  <motion.li
                                    key={subcat._id}
                                    whileHover={{ x: 5 }}
                                  >
                                    <div
                                      className={`block p-2 rounded cursor-pointer text-sm bg-gray-50 mb-2 ${
                                        isSubcategorySelected(subcat.slug)
                                          ? 'text-blue-500 text-sm bg-gray-50' 
                                          : 'hover:bg-gray-100'
                                      }`}
                                      onClick={() => handleSubcategoryClick(subcat)}
                                    >
                                      <span className="flex items-center gap-2">
                                        {subcat.title}
                                        {/* <span className="text-sm text-gray-500">
                                          ({filteredProducts.filter(p => 
                                            p.subCategory?.toLowerCase() === subcat.title.toLowerCase()
                                          ).length})
                                        </span> */}
                                      </span>
                                    </div>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      );
                    })}
                  </ul>
                )}
              </motion.div>

              {/* Latest Products Filter */}
              <motion.div
                className="bg-white p-4 rounded-lg shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-lg font-semibold mb-4">Latest Products</h2>
                {loadingProducts ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, index) => (
                      <Skeleton key={index} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products
                      .filter(product => product.category.toLowerCase() === categoryName.toLowerCase())
                      .sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                      })
                      .slice(0, 5)
                      .map((product) => (
                        <motion.div
                          key={product._id}
                          className="group cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          <Link 
                            href={`/product/${product.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                          >
                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                {product.title}
                              </h3>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < product.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="text-xs text-gray-500 ml-1">
                                  ({product.reviews})
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                  </div>
                )}

                {products.filter(product => 
                  product.category.toLowerCase() === categoryName.toLowerCase()
                ).length > 3 && (
                  <motion.button
                    className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
                    whileHover={{ x: 3 }}
                  >
                    View All Latest
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>

              {/* Ratings Filter */}
              <motion.div
                className="bg-white p-4 rounded-lg shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-lg font-semibold mb-4">Ratings</h2>
                <ul className="space-y-2">
                  {[4, 3, 2, 1, 0].map(rating => (
                    <motion.li
                      key={rating}
                      whileTap={{ scale: 0.95 }}
                    >
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
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5
                  }
                }
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <motion.h1
                  className="text-2xl font-bold"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                >
                  {loadingProducts ? (
                    <Skeleton className="h-8 w-48" />
                  ) : (
                    `${categoryName} ${selectedSubcategory ? '- ' + subcategories.find(s => s.slug === selectedSubcategory)?.title : ''}`
                  )}
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
              {loadingProducts || loadingSubcategories ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="bg-white rounded shadow overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentProducts.length > 0 ? (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  layout
                >
                  <AnimatePresence mode="wait">
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
                        className="bg-white rounded shadow overflow-hidden"
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
                            <h3 className="font-semibold  mb-1 text-center">{product.title}</h3>
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
                              <span className="text-gray-600 text-sm  ml-1">({product.reviews})</span>
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

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
      <CategoryPageContent params={params} />
    </Suspense>
  );
}