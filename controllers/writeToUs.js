import joi from "joi";
import { writeToUs } from "../models/writeToUs.js";

// added write to us
export const addWriteToUs = async (req, res) => {
  const { email, name, phoneNumber, subject, message } = req.body;

  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      name: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ.,/ ]{3,100}$"))
        .required(),
      phoneNumber: joi.number().integer().min(100000000).max(99999999999),
      subject: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ.,/ ]{3,100}$"))
        .required(),
      message: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ.,/ ]{3,100}$"))
        .required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newWriteToUs = new writeToUs({
      email,
      name,
      phoneNumber,
      subject,
      message,
    });

    const savedWriteToUs = await newWriteToUs.save();

    if (savedWriteToUs) {
      return res
        .status(200)
        .json({ message: "Müraciətiniz uğurla qeydə alındı" });
    }
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// get Write To Us Data
export const getWriteToUsData = async (req, res) => {
  try {
    const writeToUsData = await writeToUs.find();
    return res.status(200).send({ data: writeToUsData });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// get Write To Us Data By ID
export const getWriteToUsDataById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await writeToUs.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Not Found." });
    }
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
