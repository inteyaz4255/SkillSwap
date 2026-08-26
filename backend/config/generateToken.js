import jwt from "jsonwebtoken";

// Creates a signed JWT containing the user's id.
// We keep the payload minimal — just enough to identify the user;
// everything else is looked up from the DB when needed.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export default generateToken;
