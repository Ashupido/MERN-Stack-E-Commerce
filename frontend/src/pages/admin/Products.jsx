import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import productService from "../../services/productService";
import Spinner from "../../components/common/Spinner";
import ProductForm from "../../components/admin/ProductForm";
import DataTable from "../../components/admin/DataTable";
import Modal from "../../components/common/Modal";


export default function AdminProducts({ addToast }) {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [pendingDelete, setPendingDelete] = useState(null);

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

  const fetchProducts = async () => {

    try {

      setLoading(true);


      const response =
        await productService.getProducts();


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



    } catch (error) {

      console.log(error);

      setError("Failed loading products");

    }
    finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchProducts();

  }, []);




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

      await fetchProducts();



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


      fetchProducts();



    } catch (error) {


      console.log(error);


    }


  };





  if (loading) {

    return (
      <Spinner label="Loading products" />
    );

  }






  return (

    <div className="min-h-screen bg-slate-950 p-8 text-white">


      <h1 className="mb-6 text-4xl font-bold">
        Product Management
      </h1>



      <button

        onClick={() => {

          setShowForm(true);

          setEditingId(null);

        }}

        className="mb-6 rounded bg-cyan-500 px-5 py-3 text-black"

      >

        Add New Product

      </button>





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