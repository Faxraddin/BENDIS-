import { Router } from "express";
import { checkRole } from "../middleware/checkUser.js";
import { getAllUser } from "../controllers/wishList.js";
const adminUserRouter = Router();

//----------- Get All Data and Delete account ----------------//
adminUserRouter.get("/getAllUser", checkRole, getAllUser);

export default adminUserRouter;
