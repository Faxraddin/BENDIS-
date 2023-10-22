import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    reviewIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "review",
    },
    offerIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "offer",
    },
    photoUrls: { type: Array, required: true },
    brand: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // required: true,
      // ref: "brand",
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    discountEndDate: {
      type: Date,
    },
    tags: [{ type: String }],
  },
  { versionKey: false, timestamps: true }
);

export const productModel = model("product", productSchema);
