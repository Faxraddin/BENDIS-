import crypto from "crypto";
import { userModel } from "../models/user.js";
import { creditCard } from "../models/creditCard.js";

// .env faylinda saxlamaq lazimdi amma nese error verdi
let secret_key = "bendis";
let secret_iv = "bendisShop";

const key = crypto
  .createHash("sha512")
  .update(secret_key)
  .digest("hex")
  .substring(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update(secret_iv)
  .digest("hex")
  .substring(0, 16);

export function encryptData(data) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");
}

export function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, encryptionIV);
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  );
}

export const addCreditCard = async (req, res) => {
  try {
    const user = req.user.id;
    let { cardNumber, cardHolderName, expirationDate } = req.body;
    const encryptedData = encryptData(cardNumber);

    cardNumber = encryptedData;

    const newCard = new creditCard({
      cardNumber,
      cardHolderName,
      expirationDate,
    });

    const savedCard = await newCard.save();

    const userSchema = await userModel.findById(user);

    userSchema.creditCards.push(savedCard._id);

    await userSchema.save();

    res
      .status(201)
      .json({ message: "Kart uğurla əlavə edildi", data: savedCard });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Server Error, Məlumatlar saxlanıla bilmədi" });
  }
};

export const getCreditCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).populate("creditCards");

    if (!user) {
      return res.status(404).json({ error: "Istifadəçi tapılmadı" });
    }

    let creditCards = user.creditCards;

    for (let i = 0; i < creditCards.length; i++) {
      let { cardNumber } = creditCards[i];
      const decryptedCardNumber = await decryptData(cardNumber);
      creditCards[i].cardNumber = decryptedCardNumber.replace(
        /.(?=.{4})/g,
        "*"
      );
    }

    res.status(200).json({ data: creditCards });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};
