import { Router } from "express";
import {
  addToWishList,
  getAllWishListItems,
  removeFromWishList,
} from "../controllers/wishList.js";
import { checkRole } from "../middleware/checkUser.js";
const wishListRouter = Router();

// Get Single review
wishListRouter.post("/addWishList/:productId", checkRole, addToWishList);

wishListRouter.get("/getWishList", checkRole, getAllWishListItems);

wishListRouter.delete(
  "/deleteWishList/:productId",
  checkRole,
  removeFromWishList
);

export default wishListRouter;
