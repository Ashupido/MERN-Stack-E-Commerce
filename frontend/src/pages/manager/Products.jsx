import React, { useState, useEffect, useCallback, useRef } from 'react';
import productService from '../../services/productService';
import managerService from '../../services/managerService';
import DataTable from '../../components/admin/DataTable';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';

export default function ManagerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const isInitialMount = useRef(true);

  const fetchProducts = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ page, limit: 10 });
      setProducts(response.products || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to load products.');
      addToast?.('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setCurrentPage(1);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    const stockValue = Number(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
      addToast?.('Please enter a valid stock number.', 'error');
      return;
    }

    try {
      await managerService.updateProductStock(productId, stockValue);
      addToast?.('Stock updated successfully!', 'success');
      // Refresh the product list to show the new stock value
      setProducts(products.map(p => p._id === productId ? { ...p, stock: stockValue } : p));
    } catch (err) {
      addToast?.('Failed to update stock.', 'error');
    }
  };

  if (loading && products.length === 0) return <Spinner label="Loading Products..." />;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Product Stock Management</h1>
      <DataTable
        headers={[
          { key: 'name', label: 'Product Name' },
          { key: 'sku', label: 'SKU' },
          { key: 'price', label: 'Price' },
          { key: 'stock', label: 'Current Stock' },
          { key: 'actions', label: 'Update Stock' },
        ]}
        data={products.map((p) => ({
          name: <span className="font-bold">{p.name}</span>,
          sku: <span>{p.sku || 'N/A'}</span>,
          price: <span>${Number(p.price || 0).toFixed(2)}</span>,
          stock: <span className={`font-bold ${p.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>{p.stock}</span>,
          actions: (
            <div className="flex items-center gap-2">
              <input
                type="number"
                defaultValue={p.stock}
                id={`stock-${p._id}`}
                className="w-20 rounded-md bg-slate-800 p-1 text-white border border-slate-700"
              />
              <button
                onClick={() => {
                  const input = document.getElementById(`stock-${p._id}`);
                  handleStockUpdate(p._id, input.value);
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Update
              </button>
            </div>
          ),
        }))}
        noDataMessage="No products found."
      />
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-semibold text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
