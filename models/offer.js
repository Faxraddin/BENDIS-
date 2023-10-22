import mongoose, { model, Schema } from "mongoose";

const offerSchema = new Schema(
  {
    salerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "saler",
    },
    price: { type: Number, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
  },
  { versionKey: false, timestamps: true }
);

export const offerModel = model("offer", offerSchema);
