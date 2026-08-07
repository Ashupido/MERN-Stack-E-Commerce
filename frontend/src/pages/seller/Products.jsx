import React, { useState, useEffect, useCallback, useRef } from 'react';
import sellerService from '../../services/sellerService';
import DataTable from '../../components/admin/DataTable';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
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

  if (loading && products.length === 0) return <Spinner label="Loading Your Products..." />;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">My Products</h1>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
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

      <DataTable
        headers={[
          { key: 'name', label: 'Product Name' },
          { key: 'price', label: 'Price' },
          { key: 'stock', label: 'Stock' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions' },
        ]}
        data={products.map((p) => ({
          name: <span className="font-bold">{p.name}</span>,
          price: <span>${Number(p.price || 0).toFixed(2)}</span>,
          stock: <span className={`font-bold ${p.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>{p.stock}</span>,
          status: <span className="font-bold capitalize text-green-400">Active</span>, // Placeholder
          actions: (
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">Edit</button>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm">Delete</button>
            </div>
          ),
        }))}
        noDataMessage="You haven't added any products yet."
      />

      {/* Pagination Controls would go here */}
    </div>
  );
}