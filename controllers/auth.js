import { userModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import joi from "joi";
import { verifyModel } from "../models/verify.js";

// Create Token
export const maxAge = 3 * 24 * 60 * 60;

export const createToken = (id, role) => {
  return jwt.sign({ id, role }, "bendis");
};
// -----------------------------------------------------

// Email and Password error
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "User not found")
    errors.email = "Email Qeydiyyatdan Keçməyib";

  if (err.message === "Incorrect password")
    errors.password = "Password Yanlışdır";

  if (err.code === 11000) {
    errors.email = "Email İlə Artıq Qeydiyyatdan Keçilib";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
// -----------------------------------------------------

// Register
export const signUp = async (req, res) => {
  try {
    const userSchema = joi.object({
      name: joi
        .string()
        .pattern(new RegExp("^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,100}$"))
        .required(),
      surname: joi
        .string()
        .pattern(new RegExp("^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,100}$"))
        .required(),
      fatherName: joi
        .string()
        .pattern(new RegExp("^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,100}$")),
      gender: joi.string(),
      phone: joi
        .string()
        .pattern(/^(?:\+994|0)(50|51|55|70|77)\d{7}$/)
        .required(),
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "ru", "az"] } })
        .required(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ@!#$%&*_]{8,30}$"))
        .required(),
      repeat_password: joi.string().equal(joi.ref("password")).required(),
      birthday: joi.date().required(),
      role: joi.string(),
    });
    const { error, value } = userSchema.validate(req.body);
    console.log(error);
    if (error) {
      return res.status(400).send({ success: false, error: error.message });
    }

    // Check if user with the provided email already exists
    const existingUser = await userModel.findOne({ email: value.email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Email İlə Artıq Qeydiyyatdan Keçilib",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Create a new user
    const newUser = await userModel.create({
      ...value,
      password: hashedPassword,
    });
    return res.status(200).send({
      success: true,
      message: "Bendis Shop-a Xoş Gəlmişsiniz",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};
// -----------------------------------------------------

// Sign IN Login
export const signIn = async (req, res) => {
  try {
    const userSchema = joi.object({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "ru", "az"] } })
        .required(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ@!#$%&*_]{8,30}$"))
        .required(),
    });
    const {
      error,
      value: { email, password },
    } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ success: false, error: error.message });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw Error("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw Error("Incorrect password");
    }
    const token = createToken(user._id, user.role);
    console.log(token);
    res.cookie("jwt", token, {
      withCredentials: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).send({ data: user, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

// Forget Password
export const forgetPassword = async (req, res) => {
  try {
    const userSchema = joi.object({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "ru", "az"] } })
        .required(),
    });
    const {
      error,
      value: { email },
    } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ success: false, error: error.message });
    }
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res
        .status(404)
        .send({ success: false, message: "Email not found!" });
    }
    const verify_randomcode = Math.floor(Math.random() * 100000);
    await verifyModel.create({
      verify_code: verify_randomcode,
      email: userExist.email,
    });

    // nodemailer
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "quliyevnamiq8@gmail.com",
        pass: "ywmedjrilljdhjba",
      },
    });
    //mail details
    let details = {
      from: "quliyevnamiq8@gmail.com",
      to: `${email}`,
      subject: "Verify code",
      html: `Verify code : ${verify_randomcode}`,
    };
    // send mail
    mailTransporter.sendMail(details, (err) => {
      if (err) {
        return res.status(400).send({ success: false, error: err.message });
      }
      return res.status(200).send({
        success: true,
        message: "The verification code has been sent to the email address",
      });
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in forget password",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  console.log("salam");
  const verified_user = req.admin;
  const id = verified_user.id;
  const user = await userModel.findById(id);
  return res.status(200).send(user);
};
