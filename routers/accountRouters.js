import { Router } from "express";
import {
  addAddress,
  allAddress,
  deleteAccount,
  deleteAddress,
  editAddress,
  updateUserAccount,
} from "../controllers/account.js";
import { checkRole } from "../middleware/checkUser.js";

const accountRouter = Router();

accountRouter.patch("/updateAccount", checkRole, updateUserAccount);
accountRouter.delete("/deleteAccount", checkRole, deleteAccount);

// Address Routers
accountRouter.post("/addAddress", checkRole, addAddress);
accountRouter.get("/allAddress", checkRole, allAddress);
accountRouter.patch("/editAddress/:addressId", checkRole, editAddress);
accountRouter.delete("/deleteAddress/:addressId", checkRole, deleteAddress);

export default accountRouter;
