import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  story: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
});

export const Store = mongoose.model("Store", storeSchema);
