import { Router } from "express";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../controllers/review.js";
import { search } from "../controllers/user.js";
import {
  addWriteToUs,
  getWriteToUsData,
  getWriteToUsDataById,
} from "../controllers/writeToUs.js";
import { checkRole } from "../middleware/checkUser.js";
const userRouters = Router();

userRouters.post("/search", search);

// Add Write To Us Routers
userRouters.post("/writeToUs", addWriteToUs);
userRouters.get("/getWriteToUs", getWriteToUsData);
userRouters.get("/getWriteToUs/:id", getWriteToUsDataById);

// ---------- review -------------- //
userRouters.post("/createReview", checkRole, createReview);
userRouters.put("/updateReview/:id", checkRole, updateReview);
userRouters.delete("/deleteReview/:id", checkRole, deleteReview);

export default userRouters;
