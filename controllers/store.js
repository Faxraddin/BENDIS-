import { Store } from "../models/store.js";
import { userModel } from "../models/user.js";
import joi from "joi";
import { createToken, maxAge } from "./auth.js";

export const addStore = async (req, res) => {
  // Her user sadece bir dene magaza yarada biler, magaza yarandiqdan userin role saler olur ve token yenilenir
  try {
    const storeValidation = joi.object({
      name: joi.string().required(),
      address: joi.string().required(),
    });
    const { error, value } = storeValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ success: false, error: error.message });
    }

    const checkStoreName = await Store.findOne({ name: value.name });
    if (checkStoreName) {
      return res.status(409).json({
        message: `{${value.name}} Adlı Mağaza Artıq Mövcüddür, Başqa Ad Seçin`,
      });
    }
    const ownerId = req.user.id;

    const user = await userModel.findByIdAndUpdate(ownerId, { role: "saler" });

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi Tapılmadı" });
    }

    const storeData = {
      ...req.body,
      owner: ownerId,
    };

    const newToken = createToken(ownerId, "saler");

    const store = new Store(storeData);

    await store.save();

    res.cookie("jwt", newToken, {
      withCredentials: true,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ success: true, data: store });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Xətası" });
  }
};

export const getStoreData = async (req, res) => {
  // Mağazanın sadəcə adı, address, story-si, sahibi və mağazanın bütün məhsulları göndərilir və
  // sahibinin adı, soyadı və email ünvanı seçilir.

  try {
    const storeName = req.params.storeName;

    const store = await Store.findOne({ name: storeName })
      .select("name address story owner products")
      .populate("owner", "name surname email")
      .populate("products");

    if (!store) {
      return res.status(404).json({ error: "Mağaza Mövcud Deyil" });
    }

    res.json(store);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not retrieve the store data." });
  }
};

export const getStoreAllProductByName = async (req, res) => {
  // Mağazanın adına görə mağazanın bütün məhsulları göndərilir.

  try {
    const storeId = req.params.storeName;
    console.log(storeId);

    const store = await Store.findOne({ name: storeId }).populate("products");
    if (!store) {
      return res.status(404).json({ error: "Mağaza Tapılmadı." });
    }

    const products = store.products;
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Məhsullar Tapılmadı" });
  }
};

export const getStoreAllProductById = async (req, res) => {
  // Mağazanın İD-nə görə mağazanın bütün məhsulları göndərilir.

  try {
    const storeId = req.params.storeId;
    console.log(storeId);

    const store = await Store.findById(storeId).populate("product");
    if (!store) {
      return res.status(404).json({ error: "Mağaza Tapılmadı." });
    }

    const products = store.products;
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Məhsullar Tapılmadı" });
  }
};

export const editStoreByName = async (req, res) => {
  try {
    const storeName = req.params.storeName;

    const updatedStoreData = req.body;

    const updatedStore = await Store.findOneAndUpdate(
      { name: storeName },
      updatedStoreData,
      { new: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found." });
    }

    res.json(updatedStore);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not update the store." });
  }
};

export const editStoreById = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const updatedStoreData = req.body;

    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      updatedStoreData,
      { new: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found." });
    }

    res.json(updatedStore);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not update the store." });
  }
};

export const deleteStoreByName = async (req, res) => {
  // Mağazanın adına görə mağaza SİLİNİR.

  try {
    const storeName = req.params.storeName;

    const store = await Store.deleteOne({ name: storeName });

    if (store.deletedCount === 0) {
      return res.status(404).json({ error: "Mağaza Tapılmadı" });
    }

    const ownerId = req.saler.id;

    const user = await userModel.findByIdAndUpdate(ownerId, { role: "user" });

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi Tapılmadı" });
    }

    const newToken = createToken(ownerId, "user");

    res.cookie("jwt", newToken, {
      withCredentials: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ message: `Mağaza Uğurla Silindi.` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not delete the store." });
  }
};

export const deleteStoreById = async (req, res) => {
  // Mağazanın İD-nə görə mağaza SİLİNİR.

  try {
    const storeId = req.params.storeId;

    const store = await Store.findByIdAndDelete(storeId);

    if (!store) {
      return res.status(404).json({ error: "Mağaza Tapılmadı." });
    }

    const ownerId = req.saler.id;

    const user = await userModel.findByIdAndUpdate(ownerId, { role: "user" });

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi Tapılmadı" });
    }

    const newToken = createToken(ownerId, "user");

    res.cookie("jwt", newToken, {
      withCredentials: true,
      maxAge: maxAge * 1000,
    });
    res
      .status(200)
      .son({ message: `${store.name} Adlı Mağaza Uğurla Silindi.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
