import { userModel } from "../models/user.js";
import { productModel } from "../models/product.js";

// WISHLIST (SƏBƏT)
export const addToWishList = async (req, res) => {
  // User-in İD-si ilə və Product ID-si ilə user-in səbətinə məhsulun əlavə edilməsi

  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi Tapılmadı" });
    }
    if (!product) {
      return res.status(404).json({ message: "Məhsul Tapılmadı" });
    }

    const existingProduct = user.wishList.find(
      (item) => item.product == productId
    );

    if (existingProduct) {
      existingProduct.count += 1;
    } else {
      user.wishList.push({ product: product._id, count: 1 });
    }

    await user.save();

    return res.status(200).json({ message: "Məhsul Uğurla Əlavə Edildi." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
// --------------------------------------------------------------------

export const getAllWishListItems = async (req, res) => {
  // User-ın İD-si ilə user-in səbətində olan bütün productlar

  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("wishList.product");
    if (!user) {
      return res.status(404).json({ error: "İstifadəçi tapılmadı" });
    }

    return res.status(200).json(user.wishList);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Proses zamanı xəta baş verdi" });
  }
};
// --------------------------------------------------------------------

export const removeFromWishList = async (req, res) => {
  // User-in İD-si ilə user-in find edilib product İD-si ilə product-ın səbətdən silinməsi

  try {
    const productId = req.params.productId;
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi tapılmadı" });
    }
    const productIndex = user.wishList.findIndex((item) =>
      item.product._id.equals(productId)
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Məhsul Tapılmadı" });
    }

    const productInBasket = user.wishList[productIndex];

    if (productInBasket.count > 1) {
      productInBasket.count--;
    } else {
      user.wishList.pull({ product: productId });
    }
    await user.save();

    return res.status(200).json({ message: "Məhsul uğurla səbətdən silindi" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Proses zamanı xəta baş verdi" });
  }
};
// --------------------------------------------------------------------

// Get All User Data
export const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error });
  }
};
