import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Upload, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import sellerService from '../../services/sellerService';

export default function AddProduct() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    sku: '',
    image: null,
  });

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Health & Beauty',
    'Automotive',
    'Food & Beverage',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast?.('Image size must be less than 5MB', 'error');
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      addToast?.('Please fill in all required fields', 'error');
      return;
    }

    if (!formData.image) {
      addToast?.('Please upload a product image', 'error');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('category', formData.category);

      if (formData.discountPrice) data.append('discountPrice', formData.discountPrice);
      if (formData.brand) data.append('brand', formData.brand);
      if (formData.stock) data.append('stock', formData.stock);
      if (formData.sku) data.append('sku', formData.sku);
      if (formData.image) data.append('image', formData.image);

      await sellerService.createProduct(data);

      addToast?.('Product created successfully!', 'success');
      navigate('/seller/products');
    } catch (err) {
      console.error('Create product error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create product';
      addToast?.(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Merchant Workspace</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Add New Product</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Product Image */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Package className="h-6 w-6 text-amber-400" />
              <div>
                <h2 className="font-black">Product Image</h2>
                <p className="mt-1 text-sm text-slate-400">Upload a high-quality image (max 5MB)</p>
              </div>
            </div>

            <div className="mt-6">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-48 rounded-lg border border-slate-700 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-950 hover:border-amber-400">
                  <Upload className="h-12 w-12 text-slate-500" />
                  <p className="mt-2 text-sm text-slate-400">Click to upload image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Package className="h-6 w-6 text-amber-400" />
              <div>
                <h2 className="font-black">Product Details</h2>
                <p className="mt-1 text-sm text-slate-400">Required information about your product</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-300 sm:col-span-2">
                Product Name <span className="text-red-400">*</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="Enter product name"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Price (ETB) <span className="text-red-400">*</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="0.00"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Discount Price (ETB)
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="0.00"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Category <span className="text-red-400">*</span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Brand
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="Enter brand name"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Stock
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="0"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-300">
                SKU
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="Enter SKU"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-300 sm:col-span-2">
                Description <span className="text-red-400">*</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="Describe your product..."
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 font-black text-white transition hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
