// routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import { register, login, getUserProfile } from "../Controllers/authController.js";

const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, getUserProfile); // ✅ just one clean profile route

export default router;
