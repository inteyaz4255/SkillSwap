import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// A single skill entry — either something the user can teach or wants to learn
const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "React"
    type: { type: String, enum: ["teach", "learn"], required: true },
    level: { type: Number, min: 1, max: 5, default: 1 }, // stars, 1-5
    description: { type: String, trim: true, default: "" },
  },
  { _id: true } // each skill gets its own id so we can edit/delete it individually
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    profilePicture: { type: String, default: "" }, // URL
    bio: { type: String, default: "", maxlength: 300 },
    location: { type: String, default: "" },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    isOnline: { type: Boolean, default: false },
    skills: [skillSchema],

    // Denormalized rating fields — updated whenever a review is added.
    // Storing these avoids recalculating an average on every profile view.
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash the password before saving, but only if it changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check a candidate password against the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Never send the password hash back in API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
