import { Router } from "express";
import {
  addToBasket,
  getBasketData,
  deleteBasketProduct,
} from "../controllers/basket.js";
import { checkRole } from "../middleware/checkUser.js";
const basketRouter = Router();

basketRouter.post("/:productId", checkRole, addToBasket);
basketRouter.get("/getBasketData", checkRole, getBasketData);
basketRouter.delete("/:productId", checkRole, deleteBasketProduct);

export default basketRouter;
