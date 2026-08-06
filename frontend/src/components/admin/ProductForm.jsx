import { useState, useEffect } from 'react';

const categoryOptions = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Automotive',
  'Books & Stationery',
  'Uncategorized',
  'Other', // Added 'Other' for flexibility
];

export default function ProductForm({ initialData, onSubmit, onCancel, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    category: 'Uncategorized',
    brand: '',
    stock: '',
    rating: '', // Added rating
    sku: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        discountPrice: initialData.discountPrice || '',
        description: initialData.description || '',
        category: initialData.category || 'Uncategorized',
        brand: initialData.brand || '',
        stock: initialData.stock || '',
        rating: initialData.rating || '', // Set rating
        sku: initialData.sku || '',
      });
      if (initialData.images && initialData.images.length > 0) {
        setImagePreview(`http://localhost:5000/uploads/${initialData.images[0]}`);
      } else if (initialData.image) {
        setImagePreview(initialData.image);
      } else {
        setImagePreview('');
      }
    } else {
      setFormData({
        name: '',
        price: '',
        discountPrice: '',
        description: '',
        category: 'Uncategorized',
        brand: '',
        stock: '',
        rating: '', // Reset rating
        sku: '',
      });
      setImageFile(null);
      setImagePreview('');
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    if (formData.discountPrice) data.append('discountPrice', formData.discountPrice);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (formData.brand) data.append('brand', formData.brand);
    if (formData.stock !== '') data.append('stock', formData.stock);
    if (formData.rating !== '') data.append('rating', formData.rating); // Append rating
    if (formData.sku) data.append('sku', formData.sku);

    if (imageFile) {
      data.append('image', imageFile);
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-sm font-semibold text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Core Details */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="e.g. Wireless Headphones Pro"
              required
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-300">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-300">Discount Price ($)</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Optional"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-300">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option} className="bg-gray-950 text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-300">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Brand name"
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-300">Stock Qty</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-300">SKU / Model</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Unique identifier"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="e.g. 4.5"
              step="0.1"
              min="1" max="5"
            />
          </div>
        </div>

        {/* Right Column: Image Upload & Description */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">Product Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[120px] w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm leading-relaxed"
              placeholder="Describe the product features, specifications, and benefits..."
              rows="4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">Product Image File</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-950 hover:bg-gray-900 transition focus-within:border-cyan-400">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-1 text-xs text-gray-400 font-bold"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-[10px] text-gray-500">PNG, JPG or JPEG (Max 5MB)</p>
                </div>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {imagePreview && (
            <div className="relative inline-block mt-2 rounded-lg overflow-hidden border border-gray-700">
              <img
                src={imagePreview}
                alt="Product Preview"
                className="h-20 w-28 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-500 shadow transition-colors"
                title="Remove image"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4 justify-end border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-700 px-5 py-3 font-bold text-gray-200 transition hover:border-gray-500 hover:bg-white/5 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 text-sm shadow-lg shadow-cyan-950/20"
        >
          {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/40 border-t-slate-950" />}
          {initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}