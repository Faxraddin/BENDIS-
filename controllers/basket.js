import { productModel } from "../models/product.js";
import { userModel } from "../models/user.js";

// Add to Basket
export const addToBasket = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Məhsul tapılmadı" });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi tapılmadı" });
    }

    const existingProduct = user.basket.find(
      (item) => item.product == productId
    );

    if (existingProduct) {
      existingProduct.count += 1;
    } else {
      user.basket.push({ product: product._id, count: 1 });
    }

    await user.save();
    return res.status(200).json({ message: "Məhsul uğurla əlavə edildi" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Proses zamanı xəta baş verdi" });
  }
};

// Get BasketData
export const getBasketData = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("basket.product");
    if (!user) {
      return res.status(404).json({ error: "İstifadəçi tapılmadı" });
    }

    return res.status(200).json(user.basket);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Proses zamanı xəta baş verdi" });
  }
};

// Delete Basket Product
export const deleteBasketProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi tapılmadı" });
    }
    const productIndex = user.basket.findIndex((item) =>
      item.product._id.equals(productId)
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Məhsul səbətdə tapılmadı" });
    }

    const productInBasket = user.basket[productIndex];

    console.log("productInBasket:", productInBasket);
    if (productInBasket.count > 1) {
      productInBasket.count--;
    } else {
      user.basket.pull({ product: productId });
    }
    await user.save();

    return res.status(200).json({ message: "Məhsul uğurla səbətdən silindi" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Proses zamanı xəta baş verdi" });
  }
};
