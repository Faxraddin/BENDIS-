import mongoose, { Schema, model } from "mongoose";

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
});

export const addressesModel = model("address", addressSchema);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    fatherName: { type: String },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
    basket: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        count: Number,
      },
    ],
    creditCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "creditCard" }],
    wishList: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        count: Number,
      },
    ],
    role: { type: String, default: "user" },
  },
  { versionKey: false, timestamps: true }
);

// Compare provided password with the password from the database
userSchema.methods.comparePassword = async function (providedPassword) {
  try {
    return await bcrypt.compare(providedPassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed.");
  }
};

export const userModel = model("user", userSchema);
