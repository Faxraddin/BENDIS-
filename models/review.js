import mongoose, { model, Schema } from "mongoose";
const reviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    description: { type: String, required: true },
    rating: { type: Number },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
  },
  { versionKey: false, timestamps: true }
);

reviewSchema.post("save", async function () {
  await mongoose
    .model("product")
    .findByIdAndUpdate(
      { _id: this.productId },
      { $push: { reviewIds: this._id } }
    );
});

reviewSchema.pre("findOneAndDelete", async function (next) {
  const _id = this.getFilter()._id._id;
  const deleteReview = await mongoose.model("review").findOne({ _id });
  await mongoose
    .model("product")
    .findOneAndUpdate(
      { _id: deleteReview.productId },
      { $pull: { reviewIds: deleteReview._id } }
    );
  next();
});

export const reviewModel = model("review", reviewSchema);
