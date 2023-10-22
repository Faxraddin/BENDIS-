import { Router } from "express";
import { checkRole } from "../middleware/checkUser.js";
import { createOffer } from "../controllers/offer.js";
const offerRouter = Router()

//add offer
offerRouter.post('/createOffer', checkRole, createOffer)


export default offerRouter