import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import productService from "../../services/productService";
import Spinner from "../../components/common/Spinner";
import ProductForm from "../../components/admin/ProductForm";
import DataTable from "../../components/admin/DataTable";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { Package, PackageCheck, PackageX, DollarSign } from 'lucide-react';

export default function AdminProducts({ addToast }) {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [pendingDelete, setPendingDelete] = useState(null);

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const [error, setError] = useState("");



  const defaultFormData = {
    name: "",
    price: "",
    description: "",
    category: "Uncategorized",
    image: ""
  };


  const [formData, setFormData] = useState(defaultFormData);



  // ===============================
  // GET PRODUCTS
  // ===============================

  const fetchProducts = async (page = currentPage) => {

    try {

      setLoading(true);
      setError('');

      const params = {
        page,
        limit: 10,
        search: searchTerm,
        category: filterCategory,
      };

      const response =
        await productService.getProducts(params);


      console.log(
        "PRODUCT DATA:",
        response
      );


      // support both formats
      const data =
        Array.isArray(response)
          ? response
          : response.products || [];


      setProducts(data);
      setTotalProductsCount(response.totalProducts || 0);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);



    } catch (error) {

      console.log(error);

      setError("Failed loading products");

    }
    finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    // When a filter or search term changes, reset to page 1
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchProducts(1);
    }

  }, [searchTerm, filterCategory]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // ===============================
  // DERIVED STATE & HANDLERS
  // ===============================

  const productStats = useMemo(() => {
    const inStock = products.filter(p => p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return {
      total: totalProductsCount,
      inStock,
      outOfStock,
      totalValue,
    };
  }, [products, totalProductsCount]);

  const uniqueCategories = useMemo(() => {
    if (!products) return [];
    const categories = products.map(p => p.category).filter(Boolean);
    return ['all', ...new Set(categories)];
  }, [products]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // This will trigger the useEffect above
    }
  };


  // ===============================
  // CREATE / UPDATE
  // ===============================

  const handleSubmit = async (productData) => {


    try {


      setSaving(true);



      if (editingId) {


        await productService.updateProduct(
          editingId,
          productData
        );


        addToast?.(
          "Product updated successfully",
          "success"
        );


      }
      else {


        await productService.createProduct(
          productData
        );


        addToast?.(
          "Product created successfully",
          "success"
        );


      }



      // IMPORTANT
      // reload from MongoDB

      await fetchProducts(editingId ? currentPage : 1); // Go to first page on create



      setShowForm(false);

      setEditingId(null);

      setFormData(defaultFormData);



    } catch (error) {


      console.log(error);


      addToast?.(
        "Operation failed",
        "error"
      );


    }
    finally {


      setSaving(false);


    }


  };






  // ===============================
  // EDIT
  // ===============================

  const handleEdit = (product) => {


    setEditingId(product._id);


    setShowForm(true);


    setFormData({

      name: product.name,

      price: product.price,

      description: product.description,

      category:
        product.category ||
        "Uncategorized",

      image:
        product.images?.[0] || ""

    });


  };






  // ===============================
  // DELETE
  // ===============================


  const handleDelete = async () => {


    try {


      await productService.deleteProduct(
        pendingDelete._id
      );


      addToast?.(
        "Product deleted",
        "success"
      );


      setPendingDelete(null);


      await fetchProducts(currentPage); // Reload current page



    } catch (error) {


      console.log(error);


    }


  };




  if (loading && products.length === 0) {

    return (
      <Spinner label="Loading products" />
    );

  }






  return (

    <div className="min-h-screen bg-slate-950 p-8 text-white">


      <h1 className="mb-6 text-4xl font-bold">
        Product Management
      </h1>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Package className="h-6 w-6" />} title="Total Products" value={productStats.total} />
        <StatCard icon={<PackageCheck className="h-6 w-6 text-green-400" />} title="In Stock" value={productStats.inStock} />
        <StatCard icon={<PackageX className="h-6 w-6 text-red-400" />} title="Out of Stock" value={productStats.outOfStock} />
        <StatCard icon={<DollarSign className="h-6 w-6 text-emerald-400" />} title="Total Stock Value" value={`$${productStats.totalValue.toFixed(2)}`} />
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-500/30 bg-red-950/70 p-4 text-sm font-semibold text-red-100">
          {error}
        </div>
      )}

      <button

        onClick={() => {

          setShowForm(true);
          setEditingId(null);
          setFormData(defaultFormData);

        }}

        className="mb-6 rounded bg-cyan-500 px-5 py-3 font-bold text-black"

      >

        Add New Product

      </button>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-wrap items-center justify-end gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded bg-gray-700 p-2 text-white placeholder-gray-400"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded bg-gray-700 p-2 text-white"
        >
          {uniqueCategories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>





      {
        showForm &&

        <ProductForm

          initialData={
            editingId
              ?
              products.find(
                p => p._id === editingId
              )
              : null
          }

          onSubmit={handleSubmit}

          onCancel={() => {

            setShowForm(false);

            setEditingId(null);

          }}

          saving={saving}

        />

      }







      {products.length === 0 && !loading ? (
        <div className="py-10 text-center text-gray-400">No products found.</div>
      ) : (
      <DataTable


        headers={[

          {
            key: "image",
            label: "Image"
          },

          {
            key: "name",
            label: "Name"
          },

          {
            key: "price",
            label: "Price"
          },

          {
            key: "category",
            label: "Category"
          },

          {
            key: "stock",
            label: "Stock"
          },

          {
            key: "actions",
            label: "Actions"
          }

        ]}




        data={products.map(product => ({

          image: (

            <img
              src={
                product.images?.[0]
                  ? product.images[0].startsWith("/uploads/")
                    ? `http://localhost:5000${product.images[0]}`
                    : `http://localhost:5000/uploads/${product.images[0]}`
                  : "/no-image.png"
              }
              alt={product.name}
              className="h-16 w-16 rounded-lg object-cover"
              onError={(e) => {
                console.log("IMAGE ERROR:", e.target.src);
                e.target.src = "/no-image.png";
              }}
            />

          ),
          name: (

            <span className="font-bold">

              {product.name}

            </span>

          ),




          price: (

            <span>

              ETB {product.price}

            </span>

          ),




          category: (

            <span>

              {product.category}

            </span>

          ),




          stock: (

            <span>

              {product.stock}

            </span>

          ),




          actions: (

            <>

              <button

                onClick={() => handleEdit(product)}

                className="mr-2 rounded bg-blue-500 px-3 py-2"

              >

                Edit

              </button>




              <button

                onClick={() => setPendingDelete(product)}

                className="rounded bg-red-500 px-3 py-2"

              >

                Delete

              </button>


            </>


          )


        }))}


      />
      )}

      {/* Pagination Controls */}
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





      {
        pendingDelete &&


        <Modal

          isOpen={true}

          onClose={() => setPendingDelete(null)}

          onConfirm={handleDelete}

          title="Delete Product"

          confirmText="Delete"

        >


          <p>

            Delete {pendingDelete.name} ?

          </p>


        </Modal>

      }



    </div>

  );


}

// Helper component for statistics cards
function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase text-gray-500">{title}</p>
        {icon}
      </div>
      <p className="mt-2 text-3xl font-black text-amber-400">{value}</p>
    </div>
  );
}