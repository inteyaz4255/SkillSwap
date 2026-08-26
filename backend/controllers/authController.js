import User from "../models/User.js";
import generateToken from "../config/generateToken.js";

// @route  POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    // Password gets hashed automatically by the pre-save hook on the model
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Need password field explicitly since toJSON strips it, and by default
    // we don't want it selected — so re-fetch with +password here
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.isOnline = true;
    await user.save();

    const token = generateToken(user._id);

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @route  POST /api/auth/logout
// @access Private
export const logoutUser = async (req, res) => {
  try {
    req.user.isOnline = false;
    await req.user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  // req.user was already attached by the protect middleware
  res.json(req.user);
};
