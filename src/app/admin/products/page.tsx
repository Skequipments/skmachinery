"use client";

import { Category, fetchCategories } from '@/data/categories';
import TextEditor from '@/components/TextEditor';
import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiUpload } from 'react-icons/fi';

interface SubCategory {
  _id: string;
  title: string;
  parentCategory: string;
  category: string;
  slug: string;   
}

interface Product {
  _id: string;
  title: string;
  image: string;
  additionalImages?: string[];
  price?: number;
  originalPrice?: string;
  rating: number;
  reviews: number;
  category: string;
  slug: string;
  description?: string;
  specifications?: string[];
  isBestSelling?: boolean;
  isFeatured?: boolean;
  subCategory?: string;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    title: '',
    image: '',
    additionalImages: [],
    price: undefined,
    rating: 3,
    reviews: 0,
    category: '',
    slug: '',
    description: '',
    specifications: [],
    isBestSelling: false,
    isFeatured: false
  });
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [newSpecification, setNewSpecification] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, productsData, subCategoriesData] = await Promise.all([
          fetchCategories(),
          fetch('/api/products?includeDescription=true').then(res => res.json()),
          fetch('/api/subcategories').then(res => res.json())
        ]);

        setCategories(categoriesData);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setSubCategories(subCategoriesData);
      } catch (err) {
        console.error('Initial data loading error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSubCategory = !selectedSubCategory || product.subCategory === selectedSubCategory;

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;

    if (name === 'category') {
      setProductFormData(prev => ({
        ...prev,
        [name]: value,
        subCategory: '' // Reset subcategory when category changes
      }));
    } else if (target.type === 'checkbox') {
      const checked = target.checked;
      setProductFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setProductFormData(prev => ({
        ...prev,
        [name]: name === 'rating' || name === 'reviews' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload image
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Update form data with the new image URL
      setProductFormData(prev => ({
        ...prev,
        image: data.imageUrl
      }));

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Image upload failed');
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    setError(null);

    try {
      const files = Array.from(e.target.files);
      const uploadedUrls: string[] = [];
      const newPreviews: string[] = [];

      // Process all files
      for (const file of files) {
        // Create preview
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newPreviews.push(preview);

        // Upload file
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', { 
          method: 'POST', 
          body: formData 
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Image upload failed');
        uploadedUrls.push(data.imageUrl);
      }

      // Update state
      setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
      setProductFormData(prev => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), ...uploadedUrls]
      }));
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages?.filter((_, i) => i !== index)
    }));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditClick = async (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      ...product,
      description: product.description || '',
      specifications: product.specifications || [],
      additionalImages: product.additionalImages || []
    });

    // Load image previews
    try {
      if (product.image) {
        if (product.image.startsWith('data:')) {
          setImagePreview(product.image);
        } else {
          const response = await fetch(product.image);
          if (response.ok) {
            const blob = await response.blob();
            setImagePreview(URL.createObjectURL(blob));
          }
        }
      }

      if (product.additionalImages?.length) {
        const previews = await Promise.all(
          product.additionalImages.map(async (imageUrl) => {
            try {
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              return URL.createObjectURL(blob);
            } catch (err) {
              console.error('Error loading additional image:', err);
              return null;
            }
          })
        );
        setAdditionalImagePreviews(previews.filter(Boolean) as string[]);
      }
    } catch (err) {
      console.error('Error loading images:', err);
      setImagePreview('/placeholder-product.png');
    }

    setIsAddingProduct(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewClick = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setProductFormData({
      title: '',
      image: '',
      additionalImages: [],
      price: undefined,
      rating: 3,
      reviews: 0,
      category: '',
      slug: '',
      description: '',
      specifications: [],
      isBestSelling: false,
      isFeatured: false
    });
    setImagePreview(null);
    setAdditionalImagePreviews([]);
  };

  const handleAddSpecification = () => {
    if (!newSpecification.trim()) return;
    setProductFormData(prev => ({
      ...prev,
      specifications: [...(prev.specifications || []), newSpecification.trim()]
    }));
    setNewSpecification('');
  };

  const handleRemoveSpecification = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!productFormData.title || !productFormData.image || !productFormData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Generate slug
      const slug = productFormData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Prepare product data
      const productData = {
        ...productFormData,
        slug,
        price: Number(productFormData.price) || 0,
        subCategory: selectedSubCategory || productFormData.subCategory || '',
        description: productFormData.description || '',
        specifications: productFormData.specifications || [],
        additionalImages: productFormData.additionalImages || []
      };

      // Determine if we're updating or creating
      const isUpdate = !!editingProduct;
      const url = '/api/products';
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isUpdate ? { ...productData, _id: editingProduct?._id } : productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isUpdate ? 'update' : 'create'} product`);
      }

      const result = await response.json();

      // Update local state immediately
      if (isUpdate) {
        setProducts(prev => prev.map(p => p._id === editingProduct?._id ? result : p));
      } else {
        setProducts(prev => [result, ...prev]);
      }

      // Reset form
      setIsAddingProduct(false);
      setEditingProduct(null);
      setProductFormData({
        title: '',
        image: '',
        additionalImages: [],
        price: undefined,
        rating: 3,
        reviews: 0,
        category: '',
        slug: '',
        description: '',
        specifications: [],
        isBestSelling: false,
        isFeatured: false
      });
      setAdditionalImagePreviews([]);
      setImagePreview(null);
      setSelectedCategory('');
      setSelectedSubCategory('');

    } catch (error) {
      console.error('Error saving product:', error);
      setError(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      // Update local state
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    setProductFormData({
      title: '',
      image: '',
      additionalImages: [],
      price: undefined,
      rating: 3,
      reviews: 0,
      category: '',
      slug: '',
      description: '',
      specifications: [],
      isBestSelling: false,
      isFeatured: false
    });
    setImagePreview(null);
    setAdditionalImagePreviews([]);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong> 
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header and search */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={handleAddNewClick} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus /> Add New Product
          </button>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Product Form */}
      {(isAddingProduct || editingProduct) && (
        <div className="mt-8 mb-10 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isAddingProduct ? 'Add New Product' : `Edit Product: ${editingProduct?.title}`}
            </h2>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={productFormData.title || ''}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
                  <input
                    type="text"
                    name="slug"
                    value={productFormData.slug || ''}
                    onChange={(e) => {
                      const formattedValue = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');
                      setProductFormData(prev => ({
                        ...prev,
                        slug: formattedValue,
                      }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <div className="space-y-2">
                    <div>
                      <input
                        type="checkbox"
                        id="isBestSelling"
                        name="isBestSelling"
                        checked={productFormData.isBestSelling || false}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      <label htmlFor="isBestSelling" className="text-sm text-gray-700">Best Selling Product</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={productFormData.isFeatured || false}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      <label htmlFor="isFeatured" className="text-sm text-gray-700">Featured Product</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <select
                    name="category"
                    value={productFormData.category || ''}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                  <select
                    name="subCategory"
                    value={productFormData.subCategory || ''}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a sub-category (optional)</option>
                    {subCategories
                      .filter(subCat => 
                        subCat.parentCategory === productFormData.category || 
                        subCat.category === productFormData.category
                      )
                      .map(subCat => (
                        <option key={subCat._id} value={subCat.title}>
                          {subCat.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={productFormData.rating || 3}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1" max="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
                    <input
                      type="number"
                      name="reviews"
                      value={productFormData.reviews || 0}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image*</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiUpload size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg inline-flex items-center transition-colors">
                        <FiUpload className="mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                      <input
                        type="text"
                        name="image"
                        value={productFormData.image || ''}
                        onChange={handleFormChange}
                        placeholder="Or enter image URL"
                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images (Optional)</label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {additionalImagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-32 h-32">
                        <img
                          src={preview}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg inline-flex items-center transition-colors">
                      <FiUpload className="mr-2" />
                      {isUploading ? 'Uploading...' : 'Add More Images'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAdditionalImagesUpload}
                        className="hidden"
                        disabled={isUploading}
                        multiple
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <TextEditor
                    value={productFormData.description || ''}
                    onChange={(html) => setProductFormData(prev => ({
                      ...prev,
                      description: html
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSpecification}
                  onChange={(e) => setNewSpecification(e.target.value)}
                  placeholder="Add new specification"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {productFormData.specifications?.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                disabled={isUploading || isLoading}
              >
                {isUploading ? 'Uploading...' : isLoading ? 'Saving...' : isAddingProduct ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory('');
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Sub-Category</label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedCategory}
            >
              <option value="">All Sub-Categories</option>
              {subCategories
                .filter(subCat => 
                  subCat.parentCategory === selectedCategory || 
                  subCat.category === selectedCategory
                )
                .map(subCat => (
                  <option key={subCat._id} value={subCat.title}>
                    {subCat.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {(selectedCategory || selectedSubCategory) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {selectedCategory}
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubCategory('');
                  }}
                  className="ml-2 hover:text-blue-900"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {selectedSubCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {selectedSubCategory}
                <button
                  onClick={() => setSelectedSubCategory('')}
                  className="ml-2 hover:text-blue-900"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image || '/placeholder-product.png'}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-gray-900">{product.category}</div>
                      {product.subCategory && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.subCategory}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}