import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d", // Token expires in 1 day
    }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
      res.status(200).json({
      status: 200,
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username , email: user.email},
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists, Please try logging in with this email.",
      });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    const token = generateToken(newUser);
      res.status(201).json({
      status: 201,
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error", error);
    res.status(500).json({ error: error.message });
  }
};
