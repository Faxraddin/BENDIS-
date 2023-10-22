import express from "express";
import { config } from "dotenv";
import { connectionDB } from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRouter from "./routers/authRouters.js";
import userRouters from "./routers/userRouters.js";
import adminUserRouter from "./routers/adminRouters.js";
import { checkRole } from "./middleware/checkUser.js";
import basketRouter from "./routers/basketRouter.js";
import productRouter from "./routers/productRouters.js";
import reviewRouter from "./routers/reviewRouters.js";
import creditCardRouters from "./routers/creditCardRouters.js";
import offerRouter from "./routers/offerRouters.js";
import cookieParser from "cookie-parser";
import storeRouter from "./routers/storeRouters.js";
import accountRouter from "./routers/accountRouters.js";
import wishListRouter from "./routers/wishListRouters.js";

//
import "./middleware/checkDiscountValidity.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

//---------------------- DB Connection --------------------
connectionDB();

//------------------------- Morgan ------------------------
app.use("/product_pic", express.static(path.join(__dirname, "product_pic")));
app.use(morgan("dev"));

//------------------------- Cookie ------------------------
app.use(cookieParser());

//----------------- Express config ------------------------
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
//------------------------- Router ------------------------
// app.use("/checkUser", checkUser);
app.use("/auth", authRouter);
app.use("/admin", adminUserRouter);
app.use("/basket", basketRouter);
app.use("/product", productRouter);
app.use("/user", userRouters);
app.use("/creditCard", creditCardRouters);
app.use("/review", reviewRouter);
app.use("/saler", offerRouter);
app.use("/store", storeRouter);
app.use("/account", accountRouter);
app.use("/wishList", wishListRouter);

// --------------------- PORT ----------------------------
app.listen(process.env.PORT, () => {
  console.log(`URL: http://localhost:${process.env.PORT}`);
});
