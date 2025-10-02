"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function ProductPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL + "/product";

  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const columns = [
    { field: "code", headerName: "Code", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button onClick={() => startEditMode(params.row)}>📝</button>
          <button onClick={() => deleteProduct(params.row)}>🗑️</button>
        </div>
      ),
    },
  ];

  async function fetchProducts() {
    const res = await fetch(API_BASE);
    const data = await res.json();
    setProducts(data);
  }

  async function fetchCategories() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/category");
    const data = await res.json();
    setCategories(data);
  }

  const handleProductSubmit = async (data) => {
    if (editMode) {
      await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      stopEditMode();
    } else {
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    fetchProducts();
  };

  const startEditMode = (product) => {
    reset(product);
    setEditMode(true);
  };

  const stopEditMode = () => {
    setEditMode(false);
    reset({
      code: "",
      name: "",
      description: "",
      price: "",
      category: "",
      id: "",
    });
  };

  const deleteProduct = async (product) => {
    if (!confirm(`Delete ${product.name}?`)) return;
    await fetch(API_BASE, {
      method: "DELETE",
      body: JSON.stringify({ id: product.id }),
      headers: { "Content-Type": "application/json" },
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="flex gap-4 p-4">
      <div className="flex-1">
        <form onSubmit={handleSubmit(handleProductSubmit)} className="grid grid-cols-2 gap-4">
          <div>Code:</div>
          <input {...register("code", { required: true })} className="border p-1" />
          <div>Name:</div>
          <input {...register("name", { required: true })} className="border p-1" />
          <div>Description:</div>
          <textarea {...register("description", { required: true })} className="border p-1" />
          <div>Price:</div>
          <input type="number" {...register("price", { required: true })} className="border p-1" />
          <div>Category:</div>
          <select {...register("category", { required: true })} className="border p-1">
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="col-span-2 flex gap-2 mt-2">
            <input
              type="submit"
              value={editMode ? "Update" : "Add"}
              className="bg-blue-800 text-white py-1 px-4 rounded"
            />
            {editMode && (
              <button type="button" onClick={stopEditMode} className="bg-gray-800 text-white py-1 px-4 rounded">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="flex-1">
        <DataGrid rows={products} columns={columns} autoHeight disableRowSelectionOnClick />
      </div>
    </div>
  );
}
