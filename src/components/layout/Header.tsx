"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PhoneCall, Mail, ChevronDown, Search, User, ShoppingCart, X, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Product, fetchProducts } from "@/data/products";
import { SubCategory, fetchSubCategories } from "@/data/subcategories";
import { Category, fetchCategories } from "@/data/categories";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (options: Record<string, unknown>, element: string): void;
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'en',
    name: 'English',
    flag: 'https://flagcdn.com/w20/gb.png'
  });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages: Language[] = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
    { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w20/es.png' },
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w20/it.png' },
    { code: 'ja', name: '日本語', flag: 'https://flagcdn.com/w20/jp.png' },
    { code: 'zh', name: '中文', flag: 'https://flagcdn.com/w20/cn.png' },
    {code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w20/in.png' },
  ];

  // Initialize Google Translate
  useEffect(() => {
    setIsClient(true);
    
    const loadGoogleTranslate = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,de,es,fr,it,ja,zh,hi',
            autoDisplay: false
          } as Record<string, unknown>,
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      window.googleTranslateElementInit = loadGoogleTranslate;
    }

    return () => {
      const script = document.getElementById('google-translate-script');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData, subCategoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchSubCategories()
        ]);
        
        console.log('Fetched products:', productsData);
        console.log('Fetched categories:', categoriesData);
        console.log('Fetched subcategories:', subCategoriesData);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Handle language change
  const handleLanguageChange = (languageCode: string) => {
    const newLanguage = languages.find(lang => lang.code === languageCode);
    if (newLanguage) {
      setSelectedLanguage(newLanguage);
    }
    setShowLanguageMenu(false);
    
    // Change Google Translate language
    const changeLanguage = () => {
      const googleFrame = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (googleFrame) {
        googleFrame.value = languageCode;
        googleFrame.dispatchEvent(new Event('change'));
      } else {
        setTimeout(changeLanguage, 100);
      }
    };
    changeLanguage();
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] // Correct easing function format
      }
    }
  }

  const dropdownVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] // Correct easing function format
      }
    }
  }

  // Get unique categories from products
  const mappedCategories = categories.map(category => ({
    id: category._id,
    name: category.title,
    image: category.image,
    slug: category.title.toLowerCase().replace(/\s+/g, '-')
  }));

  // Get subcategories for a category
  const getSubCategories = (categoryName: string) => {
    return subCategories
      .filter(subCat => subCat.category === categoryName)
      .map(subCat => ({
        name: subCat.title,
        slug: subCat.slug
      }));
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      const results = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results.slice(0, 5))
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowResults(false)
      setShowMobileSearch(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false)
        setHoveredCategory(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    setSearchQuery('')
    setShowResults(false)
  }

  // Handle category navigation
  const handleCategoryClick = (slug: string, categoryName?: string) => {
    setIsCategoryOpen(false);
    setHoveredCategory(null);
    
    if (categoryName) {
      // Handle subcategory click
      router.push(`/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}?subcategory=${slug}`);
    } else {
      // Handle main category click
      router.push(`/category/${slug}`);
    }
  };

  return (
    <header className="w-full">
      {/* Hidden Google Translate elements */}
      <div className='VIpgJd-ZVi9od-ORHb hidden'></div>
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      {/* Top Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[hsl(var(--bonik-blue))] text-white py-2"
      >
        <div className="container-custom flex justify-between items-center">
          <motion.div
            className="flex items-center gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <PhoneCall size={16} />
              <span>+919818900247</span>
            </motion.div>
            <motion.div variants={itemVariants} className="hidden sm:flex items-center gap-2">
              <Mail size={16} />
              <span>info@skequipments.com</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Link href="/contact-us" className="hover:underline hidden sm:inline">Need Help?</Link>
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <button
                className="flex items-center gap-1 hover:bg-[hsla(0,0%,100%,.1)] px-2 py-1 rounded-md"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <img 
                  src={selectedLanguage.flag} 
                  alt={selectedLanguage.name} 
                  className="w-4 h-4 object-cover rounded-sm" 
                />
                <span>{selectedLanguage.name}</span>
                <ChevronDown size={16} />
              </button>

              {/* Language Dropdown */}
              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50"
                  >
                    <ul className="py-1">
                      {languages.map((language) => (
                        <motion.li
                          key={language.code}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <button
                            className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100
                              ${selectedLanguage.code === language.code ? 'bg-gray-50' : ''}`}
                            onClick={() => handleLanguageChange(language.code)}
                          >
                            <img 
                              src={language.flag} 
                              alt={language.name} 
                              className="w-4 h-4 object-cover rounded-sm" 
                            />
                            <span className="text-gray-700">{language.name}</span>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-4 border-b"
      >
        <div className="container-custom flex items-center md:justify-center justify-between md:gap-52">
          {/* Logo */}
          <AnimatePresence>
            {(!showMobileSearch || (isClient && window.innerWidth >= 768)) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/" className="flex items-center justify-center">
                  <Image src="/assets/images/logo/sklogo.png" alt="sk" width={110} height={55} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Search Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSearch}
              className="text-gray-600"
            >
              {showMobileSearch ? <X size={24} /> : <Search size={24} />}
            </Button>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {(showMobileSearch || (isClient && window.innerWidth >= 768)) && (
              <motion.div
                ref={searchRef}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className={`${showMobileSearch ? 'flex' : 'hidden'} md:flex flex-1 max-w-xl px-6 relative`}
              >
                <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                  <Input
                    type="text"
                    placeholder="I'm searching for..."
                    className="pr-16 rounded-md border border-gray-300 focus-visible:outline-none focus-visible:ring-0 w-full"
                    style={{ borderRadius: '20px' }}
                    value={searchQuery}
                    onChange={handleSearch}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (searchQuery && searchResults.length > 0) {
                        setShowResults(true)
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    className="absolute right-0 h-full px-4 rounded-r-[20px] bg-[hsl(var(--bonik-blue))] hover:bg-[hsl(var(--bonik-blue)/0.9)] text-white hidden md:flex items-center gap-5"
                    style={{ borderRadius: '0px 20px 20px 0px' }}
                  >
                    <Search size={18} />
                    <span>Search</span>
                  </Button>
                </form>

                {/* Search Results */}
                <AnimatePresence>
                  {showResults && searchResults.length > 0 && (
                    <motion.div
                      className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginTop: '40px' }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <ul className="py-1">
                        {searchResults.map((product, Idx) => (
                          <motion.li
                            key={Idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: Idx * 0.05 }}
                          >
                            <Link
                              href={`/product/${product.slug.toLowerCase().replace(/\s+/g, '-')}`}
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setSearchQuery('')
                                setShowResults(false)
                                setShowMobileSearch(false)
                              }}
                            >
                              <Image
                                src={product.image}
                                alt={product.title}
                                width={60}
                                height={60}
                                className="w-10 h-10 object-contain mr-3"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-800">{product.title}</p>
                                <p className="text-xs text-gray-500">{product.category}</p>
                              </div>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Category Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="hidden md:block bg-red-600 text-white shadow-md shadow-black/30 z-10"
      >
        <div className="container-custom flex items-center justify-between">
          {/* Categories Dropdown */}
          <div
            ref={categoryRef}
            className="relative group"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => {
              if (!hoveredCategory) {
                setIsCategoryOpen(false)
              }
            }}
          >
            <button
              className="flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 transition-colors h-full"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span>All Categories</span>
              <ChevronDown size={16} />
            </button>

            {/* Categories Menu */}
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  className="absolute left-0 w-56 bg-white text-gray-800 shadow-lg z-50 rounded-b-md"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  onMouseLeave={() => {
                    setIsCategoryOpen(false)
                    setHoveredCategory(null)
                  }}
                >
                  <div className="relative flex">
                    <ul className="py-1 w-full">
                      {mappedCategories.map((category, ctIdx) => (
                        <motion.li
                          key={ctIdx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ctIdx * 0.05 }}
                          className="relative"
                        >
                          <button
                            onClick={() => handleCategoryClick(category.slug)}
                            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 hover:text-blue-500 text-left border-b border-gray-200 last:border-b-0"
                            onMouseEnter={() => {
                              setHoveredCategory(category.name)
                            }}
                          >
                            <span>{category.name}</span>
                            <ChevronRight size={16} className="text-gray-400" />
                          </button>

                          {/* Subcategories */}
                          {hoveredCategory === category.name && getSubCategories(category.name).length > 0 && (
                            <motion.div
                              className="absolute left-full top-0 w-56 bg-white shadow-lg ml-1 rounded-r-md"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                            >
                              <div className="p-2">
                                <ul className="py-1">
                                  {getSubCategories(category.name).map((subCat, idx) => (
                                    <motion.li
                                      key={idx}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.05 }}
                                    >
                                      <button
                                        onClick={() => handleCategoryClick(subCat.slug, category.name)}
                                        className="w-full px-4 py-2 text-left hover:text-blue-500 text-sm hover:bg-gray-100 rounded-md"
                                      >
                                        {subCat.name}
                                      </button>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 ms-5">
            <ul className="flex items-center gap-8 py-3">
              <li className="bonik-nav-link text-white hover:text-white hover:scale-105 transition-transform">
                <Link href="/">Home</Link>
              </li>
              
              <li className="bonik-nav-link text-white hover:text-white hover:scale-105 transition-transform">
                <Link href="/about-us">About Us</Link>
              </li>
              <li className="bonik-nav-link text-white hover:text-white hover:scale-105 transition-transform">
                <Link href="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </nav>
        </div>
      </motion.div>
    </header>
  );
}