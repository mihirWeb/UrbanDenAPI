import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true }, // bcz stripe returns us objects
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);