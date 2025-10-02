"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@mui/material/Button";

export default function CustomerDetail() {
  const { id } = useParams();
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`${API_BASE}/customer/${id}`);
        if (!res.ok) throw new Error("Customer not found");
        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load customer");
      }
    };
    fetchCustomer();
  }, [id]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="m-4">
      <h1 className="text-2xl mb-4">Customer Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Date of Birth:</strong> {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Member Number:</strong> {customer.MemberNumber}</p>
        <p><strong>Interests:</strong> {customer.Interest}</p>
      </div>
      <Button
        variant="outlined"
        color="primary"
        className="mt-4"
        onClick={() => router.back()}
      >
        Back
      </Button>
    </div>
  );
}
