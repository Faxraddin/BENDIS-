import { addressesModel, userModel } from "../models/user.js";
import nodemailer from "nodemailer";
import { verifyModel } from "../models/verify.js";

export const updateUserAccount = async (req, res) => {
  // Update user account information by ID
  try {
    const userId = req.user.id;
    const {
      email: newEmail,
      basket,
      password: newPassword,
      ...rest
    } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if email is changed
    if (newEmail !== user.email) {
      const verify_randomcode = Math.floor(Math.random() * 100000);
      await verifyModel.create({
        verify_code: verify_randomcode,
        email: user.email,
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
      let mailOptions = {
        from: "quliyevnamiq8@gmail.com",
        to: `${email}`,
        subject: "Verify code",
        html: `Email changed : ${email}`,
      };

      mailTransporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error("Error sending notification:", err);
        }
      });

      // Update email address
      rest.email = newEmail;
    }

    // Check if password is provided and valid
    if (newPassword) {
      const isPasswordValid = await user.comparePassword(newPassword);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password." });
      }

      if (newPassword !== user.password) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        rest.password = hashedPassword;

        // Send email notification about password change
        const mailOptionsPasswordChange = {
          from: "quliyevnamiq8@gmail.com",
          to: newEmail,
          subject: "Password Change",
          html: `Your password has been changed.`,
        };

        mailTransporter.sendMail(mailOptionsPasswordChange, (err) => {
          if (err) {
            console.error("Error sending password change notification:", err);
          }
        });
      }
    }

    await userModel.findByIdAndUpdate(userId, rest);

    return res.json({
      success: true,
      message: "User information updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  // User-in İD-nə görə hesabın silinməsi

  const userId = req.user.id;

  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User account deleted successfully." });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Failed to delete user account." });
  }
};

//--------------------- Address -------------------
export const addAddress = async (req, res) => {
  // User-in İD-si ilə ünvan məlumatlarının əlavə edilməsi

  try {
    const { street, city, postalCode } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi Tapılmadı" });
    }

    const newAddress = await addressesModel.create({
      street,
      city,
      postalCode,
    });

    user.addresses.unshift(newAddress._id);

    await user.save();
    res.status(201).json({
      message: "Yeni Ünvan Uğurla Əlavə Edildi",
      data: newAddress,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const allAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel
      .findById(userId)
      .populate("addresses")
      .select("addresses");

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi Tapılmadı" });
    }

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const editAddress = async (req, res) => {
  // user-in və Address İD-si ilə ünvan məlumatlarının redaktə edilməsi

  try {
    const { street, city, postalCode } = req.body;
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Istifadəçi Tapılmadı" });
    }
    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ error: "Ünvan Məlumatları Tapılmadı" });
    }
    address.street = street;
    address.city = city;
    address.postalCode = postalCode;
    await user.save();
    res.status(200).json({
      message: "Ünvan Məlumatları Uğurla Dəyişdirildi.",
      data: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "İstifadəçi Tapılmadı" });
    }

    const addressIndex = user.addresses.findIndex(
      (id) => id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: "Ünvan Tapılmadı" });
    }

    user.addresses.splice(addressIndex, 1);

    await user.save();
    res.status(200).json({ message: "Ünvan Uğurla Silindi" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

//--------------------- Address -------------------
