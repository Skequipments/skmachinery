"use client";

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiUpload } from 'react-icons/fi';
import { CloudinaryUploadResponse } from '@/types/cloudinary';

interface Product {
  _id: string;
  title: string;
  image: string;
  category: string;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    title: '',
    image: '',
    category: ''  });
  const [newSpecification, setNewSpecification] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/categories');
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;

    if (target.type === 'checkbox') {
      const checked = target.checked;
      setProductFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setProductFormData(prev => ({
        ...prev,
        [name]: name === 'rating' || name === 'reviews' ? parseInt(value) || 0 : value,
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Cloudinary through your API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success || !data.imageUrl) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Update form data with Cloudinary URL
      setProductFormData(prev => ({
        ...prev,
        image: data.imageUrl
      }));

      // Set preview
      setImagePreview(data.imageUrl);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Image upload failed');
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Fixed handleEditClick function
  const handleEditClick = async (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      ...product,
      image: product.image || '' // Ensure image is always a string
    });

    // Set preview for Cloudinary image
    if (product.image) {
      setImagePreview(product.image);
    } else {
      setImagePreview(null);
    }

    setIsAddingProduct(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle add new product click
  const handleAddNewClick = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setProductFormData({
      title: '',
      image: '',
      category: ''
      // slug: '',
      // description: '',
      // specifications: []
    });
    setImagePreview(null);
  };

  // Add specification
  // const handleAddSpecification = () => {
  //   if (!newSpecification.trim()) return;

  //   setProductFormData(prev => ({
  //     ...prev,
  //     specifications: [...(prev.specifications || []), newSpecification.trim()]
  //   }));
  //   setNewSpecification('');
  // };

  // Remove specification
  // const handleRemoveSpecification = (index: number) => {
  //   setProductFormData(prev => ({
  //     ...prev,
  //     specifications: (prev.specifications || []).filter((_, i) => i !== index)
  //   }));
  // };

  // Submit product form (both add and edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate required fields
      if (!productFormData.title || !productFormData.category) {
        setError('Please fill in all required fields');
        return;
      }

      const method = isAddingProduct ? 'POST' : 'PUT';
      const url = '/api/categories';

      // Send the Cloudinary URL in the request
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productFormData,
          image: productFormData.image // This will be the Cloudinary URL
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }

      const result = await response.json();

      // Update the products list with the new/updated category
      if (isAddingProduct) {
        setProducts([...products, result]);
      } else {
        setProducts(products.map(p => p._id === result._id ? result : p));
      }

      // Reset form
      handleCancel();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Handle delete product
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Cancel form editing/adding
  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    setProductFormData({
      // rating: 3,
      // reviews: 0
    });
    setImagePreview(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Categories Management</h1>

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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
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
                      <div className="font-medium text-gray-900">{product.title}</div>
                      {/* <div className="text-sm text-gray-500">{product.slug}</div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
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
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(isAddingProduct || editingProduct) && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isAddingProduct ? 'Add New Product' : `Edit Product: ${editingProduct?.title}`}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <input
                    type="text"
                    name="category"
                    value={productFormData.category || ''}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', imagePreview);
                            (e.target as HTMLImageElement).src = '/placeholder-product.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiUpload size={24} />
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
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
                      />
                    </div>
                  </div>
                </div>
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
                disabled={isUploading}
              >
                {isAddingProduct ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}