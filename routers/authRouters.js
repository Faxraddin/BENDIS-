import { Router } from "express";

const authRouter = Router();
import { signIn, signUp, forgetPassword, getMe } from "../controllers/auth.js";
import { checkRole } from "../middleware/checkUser.js";

// user sign-up
authRouter.post("/signIn", signIn);
authRouter.post("/signUp", signUp);
authRouter.get("/getMe", checkRole("user"), getMe);
authRouter.post("/forgetPassword", forgetPassword);

export default authRouter;
