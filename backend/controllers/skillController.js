import User from "../models/User.js";

// @route  POST /api/users/me/skills
// @access Private
// body: { name, type: "teach"|"learn", level, description }
export const addSkill = async (req, res) => {
  try {
    const { name, type, level, description } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Skill name and type are required" });
    }
    if (!["teach", "learn"].includes(type)) {
      return res.status(400).json({ message: "type must be 'teach' or 'learn'" });
    }

    const user = await User.findById(req.user._id);
    user.skills.push({ name, type, level, description });
    await user.save();

    res.status(201).json(user.skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to add skill", error: error.message });
  }
};

// @route  PUT /api/users/me/skills/:skillId
// @access Private
export const updateSkill = async (req, res) => {
  try {
    const { name, level, description, type } = req.body;
    const user = await User.findById(req.user._id);

    // .id() is a Mongoose helper for finding a subdocument by its _id
    const skill = user.skills.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (name !== undefined) skill.name = name;
    if (level !== undefined) skill.level = level;
    if (description !== undefined) skill.description = description;
    if (type !== undefined) skill.type = type;

    await user.save();
    res.json(user.skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to update skill", error: error.message });
  }
};

// @route  DELETE /api/users/me/skills/:skillId
// @access Private
export const deleteSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const skill = user.skills.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // .deleteOne() on a subdocument removes it from the parent array
    skill.deleteOne();
    await user.save();

    res.json(user.skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill", error: error.message });
  }
};
