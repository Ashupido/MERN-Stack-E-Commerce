import React, { useState, useEffect, useCallback, useRef } from 'react';
import sellerService from '../../services/sellerService';
import productService from '../../services/productService';
import DataTable from '../../components/admin/DataTable';
import Spinner from '../../components/common/Spinner';
import ProductForm from '../../components/admin/ProductForm';
import Modal from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { normalizeProductImageUrl } from '../../utils/helpers';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { addToast } = useToast();

  const isInitialMount = useRef(true);

  const fetchProducts = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await sellerService.getProducts({ page, limit: 10, search: searchTerm });
      setProducts(response.products || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to load your products.');
      addToast?.('Failed to load your products', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, searchTerm]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      setSaving(true);
      if (editingId) {
        await sellerService.updateProduct(editingId, productData);
        addToast?.('Product updated successfully', 'success');
      } else {
        await sellerService.createProduct(productData);
        addToast?.('Product created successfully', 'success');
      }
      await fetchProducts(editingId ? currentPage : 1);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Product operation error:', err);
      addToast?.(err.response?.data?.error || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await sellerService.deleteProduct(pendingDelete._id);
      addToast?.('Product deleted', 'success');
      setPendingDelete(null);
      await fetchProducts(currentPage);
    } catch (err) {
      addToast?.('Failed to delete product', 'error');
    }
  };

  if (loading && products.length === 0) return <Spinner label="Loading Your Products..." />;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">My Products</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Add New Product
        </button>
      </div>

      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Search your products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md border-slate-700 bg-slate-800 p-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-4xl rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/40 my-8">
            <h2 className="text-2xl font-black text-white mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              initialData={editingId ? products.find(p => p._id === editingId) : null}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              saving={saving}
            />
          </div>
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="py-10 text-center text-gray-400">You haven't added any products yet.</div>
      ) : (
        <DataTable
          headers={[
            { key: 'image', label: 'Image' },
            { key: 'name', label: 'Product Name' },
            { key: 'price', label: 'Price' },
            { key: 'stock', label: 'Stock' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          data={products.map((p) => ({
            image: (
              <img
                src={normalizeProductImageUrl(p.images?.[0]) || '/no-image.png'}
                alt={p.name}
                className="h-16 w-16 rounded-lg object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + '/no-image.png') {
                    e.currentTarget.src = '/no-image.png';
                  }
                }}
              />
            ),
            name: <span className="font-bold">{p.name}</span>,
            price: <span>ETB {Number(p.price || 0).toFixed(2)}</span>,
            stock: <span className={`font-bold ${p.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>{p.stock}</span>,
            status: <span className="font-bold capitalize text-green-400">{p.status || 'active'}</span>,
            actions: (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setPendingDelete(p)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition"
                >
                  Delete
                </button>
              </div>
            ),
          }))}
          noDataMessage="You haven't added any products yet."
        />
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded bg-gray-700 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-bold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded bg-gray-700 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {pendingDelete && (
        <Modal
          isOpen={true}
          onClose={() => setPendingDelete(null)}
          onConfirm={handleDelete}
          title="Delete Product"
          confirmText="Delete"
        >
          <p>Delete {pendingDelete.name}?</p>
        </Modal>
      )}
    </div>
  );
}