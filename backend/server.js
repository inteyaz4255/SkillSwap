import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json()); // parse incoming JSON bodies

// Health check — handy to confirm the server is up
app.get("/", (req, res) => {
  res.json({ status: "Skill Swap API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Basic error handler — catches anything thrown that wasn't handled in a controller
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
