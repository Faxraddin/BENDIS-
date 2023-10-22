import { Router } from "express";
import { getAllProductReview } from "../controllers/review.js";
const reviewRouter = Router();

// Get Single review
reviewRouter.get("/:productId", getAllProductReview);

export default reviewRouter;
