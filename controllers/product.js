import { productModel } from "../models/product.js";
import { Store } from "../models/store.js";
import joi from "joi";

export const getProductByID = async (req, res) => {
  // Product İD-si ilə product-ın find edilməsi

  try {
    const singleProduct = await productModel.findById(req.params.productId);
    if (!singleProduct) {
      return res.status(404).json({ message: "Məhsul Tapılmadı." });
    }
    return res.status(200).json(singleProduct);
  } catch (error) {
    return res.status(500).json({
      message: "Error in get single product",
      error: error.message,
    });
  }
};
// -----------------------------------------------------

export const getAllProductByTags = async (req, res) => {
  // Tag-ina görə product-ın find edilməsid

  try {
    const category = req.params.category;
    const products = await productModel.find({ tags: category });
    if (products) {
      return res.status(200).json(products);
    } else {
      return res.status(404).json({ error: "Məhsul Tapılmadı" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error.message,
    });
  }
};
// -----------------------------------------------------

export const allProduct = async (req, res) => {
  // Bütün Məhsullar

  try {
    const products = await productModel.find();
    if (products) {
      return res.status(200).json(products);
    }
    return res.status(404).json({ message: "Məhsul Yoxdur." });
  } catch (err) {
    res.status(500).json({ error: "Server xətası" });
  }
};
// -----------------------------------------------------

export const findProductsByDiscountTag = async (req, res) => {
  // Product-un tags arrayinda olan "endirimli" tag-ina gore filter edilib gonderilmesi

  try {
    const discountedProducts = await productModel.find({ tags: "endirimli" });
    return res.status(200).json(discountedProducts);
  } catch (error) {
    console.error("Server Error", error);
    return res.status(500).json({ message: "Server Error", error: error });
  }
};
// -----------------------------------------------------

export const addProduct = async (req, res) => {
  // Məhsulun Mağaza İD-si ilə mağazaya əlavə edilməsi
  try {
    const productSchema = joi.object({
      name: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ.,/ ]{3,30}$"))
        .required(),
      description: joi
        .string()
        .required(),
      photoUrls: joi.array(),
      brand: joi.string().required(),
      price:joi.number().required(),
      tags: joi.array().items(joi.string()),
    });
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ success: false, error: error.message });
    }


    const product = await productModel.create({
      ...value,
      photoUrls: req.files,
    });

    const storeId = req.params.storeId;

    const store = await Store.findById(storeId);
    console.log(store);
    store.products.push(product._id);
    await store.save();

    return res.status(201).json({
      message: `Yeni Məhsul Uğurla ${storeId} ID-li Mağazaya Əlavə Edildi.`,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: error.message,
    });
  }
};
// -----------------------------------------------------

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const productSchema = joi.object({
      name: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ.,/ ]{3,30}$")),
      description: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ.,/ ]{3,100}$")),
      photoUrls: joi.array(),
      brandId: joi.string(),
      tags: joi.array().items(joi.string()),
    });
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ success: false, error: error.message });
    }
    const productExist = await productModel.findById(req.params.id);
    if (!productExist) {
      return res
        .status(404)
        .send({ success: false, message: "Məhsul Tapılmadı." });
    }
    if (!req.files) {
      const updateProduct = await productModel.findByIdAndUpdate(
        req.params.id,
        { $set: value },
        { new: true }
      );
      return res.status(200).send({
        success: true,
        message: "Məhsul Uğurla Dəyişdirildi.",
        updateProduct,
      });
    }
    for (let i = 0; i < req.files.length; i++) {
      productExist.photoUrls.push(req.files[i].path);
    }
    const updateProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...value, photoUrls: productExist.photoUrls } },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Məhsul Uğurla Dəyişdirildi.",
      updateProduct,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
// -----------------------------------------------------

export const deleteProduct = async (req, res) => {
  // Product-ın İD-si ilə Məhsulun silinməsi

  try {
    const productId = req.params.productId;
    const storeId = req.params.storeId;

    const store = await Store.findById(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found." });
    }

    const productIndex = store.products.indexOf(productId);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in the store." });
    }

    store.products.pull(productId);
    await store.save();

    await productModel.findByIdAndDelete(productId);

    return res
      .status(200)
      .json({ success: true, message: "Product deleted from store." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
// -----------------------------------------------------

// // Find products with discounted items in tags
// export async function findProductsByDiscountTag() {
//   try {
//     const discountedProducts = await productModel.find({ tags: "discounted" });
//     return discountedProducts;
//   } catch (error) {
//     console.error("Error finding discounted products:", error);
//     throw error;
//   }
// }

// Update discount information on a product
export const updateDiscountProduct = async (req, res) => {
  const { productId } = req.params;
  const { tags, discountedPrice, discountPercentage } = req.body;

  try {
    let updatedProduct;

    // Check if the "discount" tag is among the provided tags
    if (tags.includes("discount")) {
      // Update discount information
      updatedProduct = await updateDiscountInfo(
        productId,
        discountedPrice,
        discountPercentage
      );
    } else {
      // If the "discount" tag is not present, update without discount information
      updatedProduct = await updateDiscountInfo(productId, null, null);
    }

    res.status(200).json({ updatedProduct });
  } catch (error) {
    console.error("Error while updating discount information:", error);
    res.status(500).json({ error: "Failed to update discount information." });
  }
};
