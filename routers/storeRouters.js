import { Router } from "express";
import {
  addStore,
  deleteStoreById,
  deleteStoreByName,
  editStoreById,
  editStoreByName,
  getStoreAllProductById,
  getStoreAllProductByName,
  getStoreData,
} from "../controllers/store.js";
import { checkRole } from "../middleware/checkUser.js";
const storeRouter = Router();

// STORE CREATE
storeRouter.post("/addStore", checkRole, addStore);
// ---------------------------------------------------------------------------

// GET STORE ALL DATA BY STORE NAME
storeRouter.get("/getStoreData/:storeName", getStoreData);
// ---------------------------------------------------------------------------

// GET STORE PRODUCTS BY STORE NAME AND ID
storeRouter.get(
  "/getStoreAllProductByName/:storeName",
  getStoreAllProductByName
);

storeRouter.get("/getStoreAllProductBId/:storeId", getStoreAllProductById);
// ---------------------------------------------------------------------------

// EDIT STORE DATA BY STORE NAME AND ID
storeRouter.put("/editStoreByName/:storeName", editStoreByName);

storeRouter.put("/editStoreById/:storeId", editStoreById);
// ---------------------------------------------------------------------------

// DELETE STORE BY NAME AND ID
storeRouter.delete(
  "/deleteStoreByName/:storeName",
  checkRole,
  deleteStoreByName
);

storeRouter.delete("/deleteStoreById/:storeId", checkRole, deleteStoreById);
// ---------------------------------------------------------------------------

export default storeRouter;
