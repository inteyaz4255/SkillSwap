import User from "../models/User.js";

// @route  GET /api/users/:id
// @access Public (anyone can view a profile — needed for search/matching later)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// @route  PUT /api/users/me
// @access Private — user can only update their own profile
export const updateMyProfile = async (req, res) => {
  try {
    // Only allow specific fields to be updated this way —
    // never let the client blindly overwrite things like password or email here
    const allowedFields = ["name", "bio", "location", "experienceLevel", "profilePicture"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, // return the updated document
      runValidators: true,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
