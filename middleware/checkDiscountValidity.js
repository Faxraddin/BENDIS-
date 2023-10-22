import cron from "node-cron";
import { productModel } from "../models/product.js";

// Cron job
// Her gece saat 23:59 avtomatik olaraq butun productlari find edib endirim muddeti bitmis mehsullarin
// endirim melumatlarini null edilir.
cron.schedule(
  "59 23 * * *",
  async () => {
    try {
      const now = new Date();
      const expiredProducts = await productModel.find({
        discountEndDate: { $lte: now },
      });

      for (const product of expiredProducts) {
        product.discountedPrice = null;
        product.discountPercentage = null;
        product.discountEndDate = null;

        await product.save();
        console.log(`${product._id} ID-li məhsulun endirim vaxtı bitdi.`);
      }
    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Baku",
  }
);
