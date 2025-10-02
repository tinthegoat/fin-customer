"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const APIBASE = process.env.NEXT_PUBLIC_API_URL;

  // fetch categories
  async function fetchCategories() {
    try {
      const res = await fetch(`${APIBASE}/category`);
      const data = await res.json();
      const mapped = data.map((c) => ({ ...c, id: c._id }));
      setCategories(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // form setup
  const { register, handleSubmit, reset } = useForm();

  async function handleFormSubmit(data) {
    try {
      await fetch(`${APIBASE}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      reset();
      setOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Submit error:", err);
    }
  }

  const columns = [
    { field: "name", headerName: "Category Name", flex: 1 },
    { field: "order", headerName: "Order", width: 120 },
  ];

  return (
    <main className="p-4">
      <div className="mx-4">
        <span>Category ({categories.length})</span>
        <IconButton
          aria-label="new-category"
          color="secondary"
          onClick={() => setOpen(true)}
        >
          <AddBoxIcon />
        </IconButton>

        {/* Modal with form */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium">
                    Category Name
                  </label>
                  <input
                    {...register("name", { required: true })}
                    className="border border-gray-600 rounded-lg p-2 w-full"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Order</label>
                  <input
                    type="number"
                    {...register("order", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="border border-gray-600 rounded-lg p-2 w-full"
                    placeholder="Enter order number"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>

        {/* Grid */}
        <div style={{ height: 400, marginTop: "1rem" }}>
          <DataGrid
            rows={categories}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            autoHeight
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </main>
  );
}
