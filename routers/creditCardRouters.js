import { Router } from "express";
import { addCreditCard, getCreditCard } from "../controllers/creditCard.js";
import { checkRole } from "../middleware/checkUser.js";
const creditCardRouters = Router();

// ------------------ Credit Card Router ----------------- //
creditCardRouters.post("/addCard", checkRole, addCreditCard);
creditCardRouters.get("/creditCards", checkRole, getCreditCard);

export default creditCardRouters;
