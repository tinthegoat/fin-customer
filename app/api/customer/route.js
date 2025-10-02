import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

// List all customers
export async function GET() {
    try {
        const customers = await Customer.find();
        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}

// Add new customer
export async function POST(request) {
    try {
        const data = await request.json();
        const customer = new Customer(data);
        await customer.save();
        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add customer" }, { status: 400 });
    }
}

// Update existing customer
export async function PUT(request) {
    try {
        const data = await request.json();
        const { id, ...update } = data;
        const customer = await Customer.findByIdAndUpdate(id, update, { new: true });
        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }
        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update customer" }, { status: 400 });
    }
}

// Delete customer
export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Customer deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 400 });
    }
}