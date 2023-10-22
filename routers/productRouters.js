import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProductByTags,
  getProductByID,
  allProduct,
  updateProduct,
  findProductsByDiscountTag,
} from "../controllers/product.js";

import upload from "../config/multer.js";
import { checkRole } from "../middleware/checkUser.js";

const productRouter = Router();

// ------------------ Product Router ----------------- //
productRouter.get("/productWithCategory/:category", getAllProductByTags);

productRouter.get("/getProductById/:productId", getProductByID);

productRouter.post(
  "/addProduct/:storeId",
  upload.array("photoUrls", 10),
  addProduct
);

productRouter.put(
  "/updateProduct/:id",
  checkRole,
  upload.array("photoUrls"),
  updateProduct
);

productRouter.delete(
  "/deleteProduct/:storeId/:productId",
  checkRole,
  deleteProduct
);

productRouter.get("/allProduct", allProduct);

productRouter.get("/discounted", findProductsByDiscountTag);

export default productRouter;
