import Product from "@/models/Product";
import Category from "@/models/Category";

// List all products with category populated
export async function GET() {
  try {
    const products = await Product.find().populate("category", "name");
    // Return mapped products for frontend (DataGrid expects `id` field)
    const mapped = products.map((p) => ({
      ...p.toObject(),
      id: p._id,
      category: p.category ? p.category.name : "Uncategorized",
    }));
    return Response.json(mapped);
  } catch (err) {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Add new product
export async function POST(request) {
  const body = await request.json();
  const product = new Product(body);
  await product.save();
  const populated = await product.populate("category", "name");
  return Response.json({
    ...populated.toObject(),
    id: populated._id,
    category: populated.category ? populated.category.name : "Uncategorized",
  });
}

// Update product
export async function PUT(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true }).populate("category", "name");
  if (!product) return Response.json({ error: "Product not found" }, { status: 404 });

  return Response.json({
    ...product.toObject(),
    id: product._id,
    category: product.category ? product.category.name : "Uncategorized",
  });
}

// Delete product
export async function DELETE(request) {
  const { id } = await request.json();
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) return Response.json({ error: "Product not found" }, { status: 404 });
  return Response.json({ message: "Product deleted" });
}
