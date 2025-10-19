import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import UserModel from "../models/user.model";

// sign up new user
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missgin details" });
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      fullName,
      email,
      password: hashedPass,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await UserModel.findOne({ email });

    const isPassCorrect = await bcrypt.compare(password, userData.password);
    if (!isPassCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: userData,
      token,
      message: "Login successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
