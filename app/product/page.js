"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";


export default function Home() {
  const columns = [
    { field: 'code', headerName: 'Code', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 150 },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,

    },

    { field: 'price', headerName: 'Price', width: 150 },
    {
      field: 'Action', headerName: 'Action', width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button onClick={() => startEditMode(params.row)}>📝</button>
            <button onClick={() => deleteProduct(params.row)}>🗑️</button>
          </div>
        )
      }
    },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.debug("API_BASE", API_BASE);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [ProductList, setProductList] = useState([]);


  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    // const data = await fetch(`http://localhost:3000/product`);
    const p = await data.json();
    const p2 = p.map((product) => {
      if (!product) {
        return null;
      }
      return {
        ...product, // Ensure all product properties are spread
        id: product._id,
        category: product.category ? product.category.name : 'Uncategorized'
      };
    }).filter(Boolean);
    setProductList(p2);
    setProducts(p);
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const handleProductSubmit = (data) => {
    if (editMode) {
      // Updating a product
      fetch(`${API_BASE}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchProducts()
      });
      return
    }

    // Creating a new product
    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchProducts()
    });
  };

  // const deleteById = (id) => async () => {
  //   if (!confirm("Are you sure?")) return;

  //   await fetch(`${API_BASE}/product/${id}`, {
  //     method: "DELETE",
  //   });
  //   fetchProducts();
  // }

  const startEditMode = (product) => {
    // console.log(product)
    reset(product);
    setEditMode(true);
  }

  const stopEditMode = () => {
    setEditMode(false);
    reset({
      code: '',
      name: "",
      description: "",
      price: '',
      category: "",
    });
  }

  async function deleteProduct(product) {
    if (!confirm(`Are you sure to delete [${product.name}]`)) return;

    const id = product._id
    await fetch(`${API_BASE}/product/${id}`, {
      method: "DELETE"
    })
    fetchProducts()
    fetchCategory()
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 w-64 ">
        <form onSubmit={handleSubmit(handleProductSubmit)}>
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Code:</div>
            <div>
              <input
                name="code"
                type="text"
                {...register("code", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Description:</div>
            <div>
              <textarea
                name="description"
                {...register("description", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Price:</div>
            <div>
              <input
                name="price"
                type="number"
                {...register("price", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Category:</div>
            <div>
              <select
                name="category"
                {...register("category", { required: true })}
                className="border border-black w-full"
              >
                {category.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            {editMode ?
              <>
                <input
                  type="submit"
                  value="Update"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
                {' '}
                <button
                  onClick={() => stopEditMode()}
                  className=" italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >Cancel
                </button>
              </>
              :
              <div className="col-span-2">
                <input
                  type="submit"
                  value="Add"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
              </div>
            }
          </div>
        </form>
      </div>
      {/* <div className="border m-4 bg-slate-300 flex-1 w-64">
        <h1 className="text-2xl">Products ({products.length})</h1>
        <ul className="list-disc ml-8">
          {
            products.map((p) => (
              <li key={p._id}>
                <button className="border border-black p-1/2" onClick={deleteById(p._id)}>❌</button>{' '}
                <button onClick={() => startEditMode(p)}>📝</button>{' '}
                <Link href={`/product/${p._id}`} className="font-bold">
                  {p.name}
                </Link>{" "}
                - {p.description} (${p.price})
              </li>
            ))}
        </ul>
      </div> */}

      <div className="mx-4">
        <DataGrid
          rows={ProductList}
          columns={columns}
        />
      </div>
    </div>
  );
}
