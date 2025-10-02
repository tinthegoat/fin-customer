import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    MemberNumber: { type: Number, required: true },
    Interest: { type: String, required: true },
    },
);

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;
