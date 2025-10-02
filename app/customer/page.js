"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function CustomerPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/customer`);
      const data = await res.json();
      const mapped = data.map((c) => ({ ...c, id: c._id }));
      setCustomers(mapped);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => {
    reset();
    setEditId(null);
    setModalOpen(false);
  };

  // Save customer (create or update)
  const saveCustomer = async (data) => {
    try {
      if (editId) {
        await fetch(`${API_BASE}/customer`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...data }),
        });
        setEditId(null);
      } else {
        await fetch(`${API_BASE}/customer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      reset();
      fetchCustomers();
      handleClose();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${API_BASE}/customer`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchCustomers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Edit customer
  const startEdit = (customer) => {
    setValue("name", customer.name);
    setValue("dateOfBirth", customer.dateOfBirth.split("T")[0]);
    setValue("MemberNumber", customer.MemberNumber);
    setValue("Interest", customer.Interest);
    setEditId(customer._id);
    setModalOpen(true);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "dateOfBirth", headerName: "Date of Birth", width: 120 },
    { field: "MemberNumber", headerName: "Member #", width: 100 },
    { field: "Interest", headerName: "Interests", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 320, // increased width to fit buttons
      renderCell: (params) => (
        <div className="flex gap-1">
          <Button
            size="small"
            onClick={() => startEdit(params.row)}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => deleteCustomer(params.row._id)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
          <Button
            size="small"
            onClick={() => router.push(`/customer/${params.row._id}`)}
            variant="contained"
            color="secondary"
          >
            Detail
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl">Customers ({customers.length})</h1>
        <IconButton onClick={handleOpen} color="secondary">
          <AddBoxIcon fontSize="large" />
        </IconButton>
      </div>

      <DataGrid
        rows={customers}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
      />

      <Modal open={modalOpen} onClose={handleClose}>
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4">
              {editId ? "Edit Customer" : "Add Customer"}
            </h2>
            <form
              onSubmit={handleSubmit(saveCustomer)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register("name", { required: true })}
                  className="border border-gray-600 rounded-lg p-2 w-full"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth", { required: true })}
                  className="border border-gray-600 rounded-lg p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Member Number
                </label>
                <input
                  type="number"
                  {...register("MemberNumber", { required: true })}
                  className="border border-gray-600 rounded-lg p-2 w-full"
                  placeholder="Enter member number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Interests</label>
                <input
                  {...register("Interest", { required: true })}
                  className="border border-gray-600 rounded-lg p-2 w-full"
                  placeholder="Enter interests"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {editId ? "Update" : "Save"}
                </Button>
                {editId && (
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
