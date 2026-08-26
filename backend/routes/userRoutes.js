import express from "express";
import { getUserProfile, updateMyProfile } from "../controllers/userController.js";
import { addSkill, updateSkill, deleteSkill } from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// IMPORTANT: /me routes must be declared BEFORE /:id,
// otherwise Express will treat "me" as an :id param and hit getUserProfile instead.
router.put("/me", protect, updateMyProfile);
router.post("/me/skills", protect, addSkill);
router.put("/me/skills/:skillId", protect, updateSkill);
router.delete("/me/skills/:skillId", protect, deleteSkill);

router.get("/:id", getUserProfile);

export default router;
