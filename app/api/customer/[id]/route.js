import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const customer = await Customer.findById(params.id);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}
