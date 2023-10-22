import { model, Schema } from "mongoose";

const creditCardSchema = new Schema(
  {
    cardNumber: { type: String, required: true },
    cardHolderName: { type: String, required: true },
    expirationDate: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export const creditCard = model("creditCard", creditCardSchema);
