import { reviewModel } from "../models/review.js";

// add review
export const createReview = async (req, res) => {
  try {
    const { description, rating, productId } = req.body;
    const review = await reviewModel.create({
      userId: req.user.id,
      description,
      rating,
      productId,
    });
    return res
      .status(201)
      .send({ success: true, message: "New review created!", review });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in create review",
      error: error.message,
    });
  }
};

// update review
export const updateReview = async (req, res) => {
  try {
    const updateReview = await reviewModel.findByIdAndUpdate(
      { userId: req.user.id, _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, message: "Product review updated", updateReview });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in update review",
      error: error.message,
    });
  }
};

// delete review
export const deleteReview = async (req, res) => {
  try {
    await reviewModel.findByIdAndDelete({
      userId: req.user.id,
      _id: req.params.id,
    });
    return res
      .status(200)
      .send({ success: true, message: "Product review deleted" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in delete review",
      error: error.message,
    });
  }
};

// get product reviews
export const getAllProductReview = async (req, res) => {
  try {
    const productReviews = await reviewModel.find({
      productId: req.params.productId,
    });
    return res
      .status(200)
      .send({ success: true, message: "Product reviews", productReviews });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in All review",
      error: error.message,
    });
  }
};
