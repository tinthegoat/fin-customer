"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${API_BASE}/product`);
      const data = await res.json();
      const p = data.find((item) => item._id === params.id);
      setProduct(p);
    };
    fetchProduct();
  }, [params.id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p><strong>Code:</strong> {product.code}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category?.name}</p>
    </div>
  );
}
