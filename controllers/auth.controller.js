const { generateToken } = require("../helpers");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({ message: "password in correct" });
    }

    //generate tokend
    const token = await generateToken({ userId: user._id });

    res.status(200).json({
      message: "Success",
      data: {
        userName: user.userName,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err?.message || "Internal Server Error!",
    });
  }
};
const registerController = async (req, res, next) => {
  try {
    //check user exist with email id or not.
    const { userName, email, password } = req.body;
    const userExist = await userModel.findOne({ email }).lean();

    if (userExist) {
      return res.status(400).json({
        message: "User is Already Exist please try again with different Email!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await userModel({
      userName,
      email,
      password: hashedPassword,
    }).save();
    //generate token
    let token = await generateToken({ userId: newUser._id });
    res.status(200).json({
      message: "success",
      data: {
        token,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err?.message || "Internal Server Error!",
    });
  }
};

module.exports = {
  registerController,
  loginController,
};
